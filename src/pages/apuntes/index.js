import { remove } from "lodash"
import React, { useContext, useEffect, useState } from "react"
import { jsonToCSV } from "react-papaparse"
import { NoteDrawer } from "../../components/drawer/NoteDrawer/NoteDrawer"
import { AddNoteIcon } from "../../components/icons/AddNoteIcon"
import { Page } from "../../components/layout/Pages/Page"
import { PageBody } from "../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../components/overlay/Popup/Popup"
import useNoteApi from "../../hooks/api/useNoteApi"
import useUserApi from "../../hooks/api/useUserApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { noteFetchHandler } from "../../swr/note.swr"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { errorHandler } from "../../utils/errors"
import {
  checkDataIsEmpty,
  getFieldGRoupObjectById,
  getFieldObjectById
} from "../../utils/functions/global"
import {
  noteDataTransform,
  transformNotesToExport
} from "../../utils/functions/import_export/notes_helpers"
import { LoadingView } from "../../views/common/LoadingView"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import { NewNoteModal } from "../../views/notes/NewNote/NewNoteModal/NewNoteModal"
import { NotesGrid } from "../../views/notes/NotesGrid/NotesGrid"
import { NotesGroup } from "../../views/notes/NotesGroup/NotesGroup"
import { NotesMenu } from "../../views/notes/NotesMenu/NotesMenu"
import { ResponseModal } from "../../views/notes/Response/ResponseModal/ResponseModal"
import download from "downloadjs"
import { NotesFilterModal } from "../../views/notes/NotesFilter/NotesFilterModal"
import { NOTES_FILTER_KEYS } from "../../utils/constants/filter"
import { generateFilterQuery } from "../../utils/functions/filter"
import { getGroupOptionLabel } from "../../utils/functions/objects"
import { useRouter } from "next/router"

const NOTES_GROUP_OPTIONS = [
  {
    label: "Proyecto",
    value: "alias"
  },
  {
    label: "Año",
    value: "year"
  },
  {
    label: "Sector",
    value: "sector"
  },
  {
    label: "Tags de apunte",
    value: "notes.tags.name"
  }
]

const apuntes = () => {
  // Hooks
  const { isLoggedIn, user } = useContext(ApiAuthContext)
  const { deleteNote, deleteMessage, createNote } = useNoteApi()
  const { updateUser } = useUserApi()
  const { showToast } = useContext(ToastContext)
  const router = useRouter()

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [messageToUpdate, setMessageToUpdate] = useState(null)
  const [showNoteDetails, setShowNoteDetails] = useState(false)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteToUpdate, setNoteToUpdate] = useState(null)
  const [noteToDetail, setNoteToDetail] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [messageToDelete, setMessageToDelete] = useState(null)

  const [filterValues, setFilterValues] = useState({})
  const [queryFilter, setQueryFilter] = useState(null)
  const [queryGroup, setQueryGroup] = useState(null)
  const [querySearch, setQuerySearch] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate, isValidating } = noteFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleNotesData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState == fetchType.GROUP) return data
    return data[0]?.notes
  }

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleNotesData(isEmptyData)

  const isGrouped = fetchState == fetchType.GROUP

  const checkIsFavorite = (id) => user?.favorites?.notes?.includes(id)
  const checkIsSubscribe = (id) => user?.subscribed?.notes?.includes(id)

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const isMenuHidden = () => {
    if (isLoading) return false
    if (fetchState === fetchType.GROUP) return false
    if (isEmptyData && fetchState === fetchType.FILTER) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleOnCloseModal = () => {
    setNoteToUpdate(null)
    setIsNoteModalOpen(false)
  }

  const handleOpenDetail = (note, key) => {
    if (fetchState === fetchType.GROUP) {
      setNoteToDetail({ note, key })
    } else setNoteToDetail(note)
    setShowNoteDetails(true)
    router.replace(`${router.pathname}`, { query: { note: note?._id } })
  }

  const handleOpenEditResponse = (message) => {
    setMessageToUpdate(message)
    setIsResponseModalOpen(true)
  }

  const handleOnOpenFilter = () => {
    setShowFilterModal(true)
  }

  // Handlers CRUD
  const handleDeleteMessageToNote = () => {
    if (!noteToDelete) return

    const label = isGrouped
      ? getFieldGRoupObjectById(
          notesData,
          "title",
          noteToDelete.id,
          noteToDelete.key
        )
      : getFieldObjectById(notesData, "title", noteToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleImportNotes = async (data) => {
    const formatCreateNote = (note) => {
      const formatData = {
        project: note?.project,
        title: note?.title,
        description: note?.description
      }
      if (note?.testSystems?.length > 0) {
        formatData["testSystems"] = note?.testSystems?.map((s) => s)
      }
      if (note?.tags) formatData["tags"] = note?.tags?.map((t) => t)
      if (note?.link) formatData["link"] = note.link
      if (note?.documents) formatData["file"] = note.documents
      const formData = new FormData()

      Object.entries(formatData).forEach(([key, value]) => {
        Array.isArray(value)
          ? value.forEach((v) => formData.append(key, v))
          : formData.append(key, value)
      })

      return formData
    }

    const handleCreateNote = async (info) => {
      try {
        const note = formatCreateNote(info)
        await createNote(note)
      } catch (error) {
        errorHandler(error)
      }
    }

    try {
      for (let index = 0; index < data.length; index++) {
        await handleCreateNote(data[index])
      }

      setShowImportModal(false)
      showToast({ message: "Proyectos importados correctamente" })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportNotes = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformNotesToExport(notesData))
    download(_data, `apuntes_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleDelete = async () => {
    try {
      if (isGrouped) {
        await await deleteNote(noteToDelete.id)
        showToast({ message: "Apunte borrado correctamente" })
        setNoteToDelete(null)
        return await mutate()
      }

      await deleteNote(noteToDelete)
      showToast({ message: "Apunte borrado correctamente" })

      const updatedNotes = []
      const filterNotes = notesData.filter((note) => note._id !== noteToDelete)
      updatedNotes.push({
        notes: filterNotes
      })

      updatedNotes[0].notes.length > 0
        ? await mutate(updatedNotes, false)
        : await mutate()

      if (showNoteDetails) {
        setShowNoteDetails(false)
        router.replace(`${router.pathname}`)
      }
      setNoteToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage(messageToDelete.noteId, messageToDelete.messageId)
      showToast({ messgage: "Mensaje borrado correctamente" })
      await mutate()
      setMessageToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = () => {
    let note = null
    if (fetchState == fetchType.GROUP) {
      const {
        note: { _id },
        key
      } = noteToDetail
      note = notesData[key].find((note) => note._id === _id)
    } else {
      note = notesData.find((note) => note._id === noteToDetail._id)
    }

    setNoteToUpdate(note)
    setIsNoteModalOpen(true)
  }

  const formatUpdateUsersFavorites = (user, favorites) => {
    return {
      alias: user.alias,
      name: user.name,
      favorites,
      department: user.department
    }
  }

  const formatUpdateUsersSubscribed = (user, subscribed) => {
    return {
      alias: user.alias,
      name: user.name,
      subscribed,
      department: user.department
    }
  }

  const handleFavorite = async (id, state) => {
    const { favorites, _id } = user
    const { notes: favoritesNotes } = favorites

    if (state) {
      remove(favoritesNotes, (e) => e === id)
      favorites.notes = favoritesNotes
    } else {
      favorites.notes.push(id)
    }

    const formatUser = formatUpdateUsersFavorites(user, favorites)

    await updateUser(_id, formatUser)
    await mutate()
  }

  const handleSubscribe = async (id, state) => {
    const { subscribed, _id } = user
    const { notes: subscribedNotes } = subscribed

    if (state) {
      remove(subscribedNotes, (e) => e === id)
      subscribed.notes = subscribedNotes
    } else {
      subscribed.notes.push(id)
    }

    const formatUser = formatUpdateUsersSubscribed(user, subscribed)
    await updateUser(_id, formatUser)
    await mutate()
  }

  // Filters
  const handleOnGroup = (group) => {
    if (!group) {
      setQueryGroup(null)
      if (queryFilter) {
        setFetchState(fetchType.FILTER)
        setFetchOptions({
          [fetchOption.FILTER]: queryFilter
        })
        return
      } else {
        setFetchState(fetchType.ALL)
        setFetchOptions({
          [fetchOption.GROUP]: null
        })
        return
      }
    }

    setQueryGroup(group)
    let query = group
    if (queryFilter) query = `${query}&${queryFilter}`
    if (querySearch) query = `${query}&${querySearch}`
    setFetchState(fetchType.GROUP)
    setFetchOptions({
      [fetchOption.GROUP]: query
    })
  }

  const onSearch = (search) => {
    if (!search) {
      if (queryGroup) {
        setFetchState(fetchType.GROUP)
        setFetchOptions({
          [fetchOption.GROUP]: queryGroup
        })
        return
      } else {
        setFetchState(fetchType.ALL)
        setQueryFilter(null)
        setFetchOptions({
          [fetchOption.SEARCH]: null
        })
        return
      }
    }

    setQueryFilter(null)
    setQuerySearch(`notes.title=${search}&notes.ref=${search}`)
    let query = `notes.title=${search}&notes.ref=${search}`

    if (fetchState === fetchType.GROUP) {
      setFetchState(fetchType.GROUP)
      setFetchOptions({
        [fetchOption.GROUP]: `${queryGroup}&${query}`
      })
    } else {
      setFetchState(fetchType.SEARCH)
      setFetchOptions({
        [fetchOption.SEARCH]: query
      })
    }
  }

  const handleOnFilter = (values, type) => {
    if (!values) {
      setQueryFilter(null)

      if (queryGroup) {
        setFetchState(fetchType.GROUP)
        setFetchOptions({
          [fetchOption.GROUP]: queryGroup
        })
        return
      } else {
        setFetchState(fetchType.ALL)

        setFetchOptions({
          [fetchOption.FILTER]: null
        })
        return
      }
    }

    let filter = null
    if (type !== "complex") {
      filter = generateFilterQuery(NOTES_FILTER_KEYS, values)
    } else {
      filter = `query=${values}`
    }

    setQuerySearch(null)
    setQueryFilter(filter)

    if (fetchState === fetchType.GROUP) {
      const newGroup = `${queryGroup}&${filter}`
      setFetchState(fetchType.GROUP)
      setFetchOptions({
        [fetchOption.GROUP]: newGroup
      })
    } else {
      setFetchState(fetchType.FILTER)
      setFetchOptions({
        [fetchOption.FILTER]: filter
      })
    }

    setShowFilterModal(false)
  }

  useEffect(() => {
    if (!noteToDetail) return

    let newNoteToDetail = null
    if (fetchState === fetchType.GROUP) {
      newNoteToDetail = notesData[noteToDetail.key].find(
        (note) => note._id === noteToDetail?.note._id
      )
    } else {
      newNoteToDetail = notesData.find((note) => note._id === noteToDetail._id)
    }

    if (!newNoteToDetail) return

    setNoteToDetail(newNoteToDetail)
  }, [notesData])

  useEffect(() => {
    if (!router.query?.note || !notesData) return

    const noteDetail = notesData?.find((n) => n._id === router.query?.note)

    setNoteToDetail(noteDetail)
    setShowNoteDetails(true)
  }, [router.query, notesData])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page pb="0">
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={noteToDelete}
        onConfirm={handleDelete}
        onClose={() => setNoteToDelete(null)}
      >
        {handleDeleteMessageToNote()}
      </Popup>

      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={messageToDelete}
        onConfirm={handleDeleteMessage}
        onClose={() => setMessageToDelete(null)}
      >
        {`¿Deseas eliminar el mensaje seleccionado?`}
      </Popup>

      <NotesFilterModal
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values, type) => handleOnFilter(values, type)}
      />

      <ResponseModal
        messageToUpdate={messageToUpdate}
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        noteId={noteToDetail?._id}
      />

      <NewNoteModal
        noteToUpdate={noteToUpdate}
        isOpen={isNoteModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportNotes()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportNotes(data)}
        onDropDataTransform={(info) => noteDataTransform(info)}
      />

      <NoteDrawer
        note={fetchState === fetchType.GROUP ? noteToDetail?.note : noteToDetail}
        isOpen={showNoteDetails}
        onClose={() => {
          setShowNoteDetails(false)
          router.replace(`${router.pathname}`)
          setNoteToDetail(null)
          mutate()
        }}
        onDelete={() => setNoteToDelete(noteToDetail._id)}
        onEdit={handleUpdate}
        onResponse={() => setIsResponseModalOpen(true)}
        onEditResponse={(message) => handleOpenEditResponse(message)}
        onDeleteResponse={(noteId, messageId) =>
          setMessageToDelete({
            noteId,
            messageId
          })
        }
      />

      <PageHeader>
        <BreadCrumbs customURL={"/apuntes"} />
        {isToolbarHidden() && (
          <ToolBar
            onAdd={() => setIsNoteModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={handleOnOpenFilter}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir apunte"
            searchPlaceholder="Busqueda por ID, Proyecto"
            groupOptions={NOTES_GROUP_OPTIONS}
            icon={<AddNoteIcon />}
            fetchState={fetchState}
            queryFilter={queryFilter}
            queryGroup={queryGroup}
          />
        )}
      </PageHeader>
      <PageMenu>
        {isMenuHidden() ? (
          <NotesMenu
            fetchState={fetchState}
            notesCount={notesData?.length}
            onChange={(state) => setFetchState(state)}
          />
        ) : null}
      </PageMenu>
      <PageBody height="calc(100vh - 140px)" overflowY="auto">
        {isLoading ? (
          <LoadingView mt="-200px" />
        ) : isEmptyData && fetchState !== fetchType.ALL ? (
          <ViewNotFoundState noBack />
        ) : isEmptyData && !isValidating ? (
          <ViewEmptyState
            message="Añadir apuntes a la plataforma"
            importButtonText="Importar"
            addButtonText="Añadir apunte"
            onImport={() => setShowImportModal(true)}
            onAdd={() => setIsNoteModalOpen(true)}
          />
        ) : (
          <>
            {fetchState === fetchType.GROUP ? (
              <NotesGroup
                notes={notesData}
                onSeeDetails={handleOpenDetail}
                onFilter={handleOnOpenFilter}
                checkIsSubscribe={checkIsSubscribe}
                checkIsFavorite={checkIsFavorite}
                onDelete={(id, key) => setNoteToDelete({ id, key })}
                onGroup={handleOnGroup}
                handleFavorite={handleFavorite}
                groupOption={getGroupOptionLabel(
                  NOTES_GROUP_OPTIONS,
                  fetchOptions[fetchOption.GROUP]
                )}
                isGrouped={isGrouped}
                fetchState={fetchState}
                handleSubscribe={handleSubscribe}
                queryFilter={queryFilter}
                queryGroup={queryGroup}
              />
            ) : (
              <NotesGrid
                notes={notesData}
                onSeeDetails={handleOpenDetail}
                checkIsSubscribe={checkIsSubscribe}
                checkIsFavorite={checkIsFavorite}
                onDelete={setNoteToDelete}
                handleFavorite={handleFavorite}
                handleSubscribe={handleSubscribe}
                fetchState={fetchState}
                queryFilter={queryFilter}
                onFilter={() => handleOnFilter(null)}
              />
            )}
          </>
        )}
      </PageBody>
    </Page>
  )
}

export default apuntes
