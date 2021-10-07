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
  generateQueryStr,
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
import { generateFilterQueryObj } from "../../utils/functions/filter"
import { getGroupOptionLabel } from "../../utils/functions/objects"

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

  // Fetch
  const { data, error, isLoading, mutate } = noteFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleNotesData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState == fetchType.GROUP) return data
    return data[0].notes

    // TODO FILTER
  }

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleNotesData(isEmptyData)

  const isSearch = fetchState == fetchType.SEARCH
  const isGrouped = fetchState == fetchType.GROUP

  const checkIsFavorite = (id) => user?.favorites?.notes?.includes(id)
  const checkIsSubscribe = (id) => user?.subscribed?.notes?.includes(id)

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleOnCloseModal = () => {
    setNoteToUpdate(null)
    setIsNoteModalOpen(false)
  }

  const handleOpenDetail = (note) => {
    setNoteToDetail(note)
    setShowNoteDetails(true)
  }

  const handleOpenEditResponse = (message) => {
    setMessageToUpdate(message)
    setIsResponseModalOpen(true)
  }

  // Handlers CRUD
  const handleDeleteMessageToNote = () => {
    if (!noteToDelete) return

    const label = isGrouped
      ? getFieldGRoupObjectById(notesData, "ref", noteToDelete.id, noteToDelete.key)
      : getFieldObjectById(notesData, "ref", noteToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleImportNotes = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      const projectsCreated = []
      for (let index = 0; index < data.length; index++) {
        const pro = await createNote(data[index])
        projectsCreated.push(pro)
      }

      setShowImportModal(false)
      showToast("Proyectos importados correctamente")
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
        showToast("Apunte borrado correctamente")
        setNoteToDelete(null)
        return await mutate()
      }

      await deleteNote(noteToDelete)
      showToast("Apunte borrado correctamente")

      const updatedNotes = []
      const filterNotes = notesData.filter((note) => note._id !== noteToDelete)
      updatedNotes.push({
        notes: filterNotes
      })
      updatedNotes.length > 0 ? await mutate(updatedNotes, false) : await mutate()

      if (showNoteDetails) setShowNoteDetails(false)
      setNoteToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage(messageToDelete.noteId, messageToDelete.messageId)
      showToast("Mensaje borrado correctamente")
      await mutate()
      setMessageToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const note = notesData.find((note) => note._id === id)
    setNoteToUpdate(note)
    setIsNoteModalOpen(true)
  }

  const formatUpdateUsers = (user, favorites) => {
    return {
      alias: user.alias,
      name: user.name,
      favorites,
      department: user.department
    }
  }

  // state === true ? deleteFavorite : createFavorite
  const handleFavorite = async (id, state) => {
    const { favorites, _id } = user
    const { notes: favoritesNotes } = favorites

    if (state) {
      remove(favoritesNotes, (e) => e === id)
      favorites.notes = favoritesNotes
    } else {
      favorites.notes.push(id)
    }

    const formatUser = formatUpdateUsers(user, favorites)

    await updateUser(_id, formatUser)
    await mutate()
  }

  // Filters
  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.SEARCH]: null
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: search
    })
  }

  const handleOnGroup = (group) => {
    if (!group) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.GROUP]: null
      })
      return
    }

    setFetchState(fetchType.GROUP)
    setFetchOptions({
      [fetchOption.GROUP]: group
    })
  }

  const handleOnFilter = (values) => {
    console.log(generateQueryStr(generateFilterQueryObj(NOTES_FILTER_KEYS, values)))
    // setFetchState(fetchType.FILTER)
    // setFetchOptions({
    //   [fetchOption.FILTER]: filter
    // })
  }

  useEffect(() => {
    if (!noteToDetail) return

    const newNoteToDetail = notesData.find((note) => note._id === noteToDetail._id)

    if (!newNoteToDetail) return

    setNoteToDetail(newNoteToDetail)
  }, [notesData])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
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
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values) => handleOnFilter(values)}
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
        note={noteToDetail}
        isOpen={showNoteDetails}
        onClose={() => setShowNoteDetails(false)}
        onDelete={() => setNoteToDelete(noteToDetail._id)}
        onEdit={() => handleUpdate(noteToDetail._id)}
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
        <BreadCrumbs />
        {isToolbarHidden() && (
          <ToolBar
            onAdd={() => setIsNoteModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={() => setShowFilterModal(true)}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir apunte"
            searchPlaceholder="Busqueda por ID, Proyecto"
            groupOptions={NOTES_GROUP_OPTIONS}
            icon={<AddNoteIcon />}
            fetchState={fetchState}
          />
        )}
      </PageHeader>
      <PageMenu>
        {notesData && !isGrouped ? (
          <NotesMenu
            fetchState={fetchState}
            notesCount={notesData?.length}
            onChange={(state) => setFetchState(state)}
          />
        ) : null}
      </PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData && isSearch ? (
          <ViewNotFoundState />
        ) : isEmptyData ? (
          <ViewEmptyState
            message="Añadir apuntes a la plataforma"
            importButtonText="Importar"
            addButtonText="Añadir apunte"
            onImport={() => setShowImportModal(true)}
            onAdd={() => setIsNoteModalOpen(true)}
          />
        ) : null}

        {notesData ? (
          <>
            {fetchState === fetchType.GROUP ? (
              <NotesGroup
                notes={notesData}
                onSeeDetails={handleOpenDetail}
                subscribedUsers={null} // TOPO -> review
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
              />
            ) : (
              <NotesGrid
                notes={notesData}
                onSeeDetails={handleOpenDetail}
                subscribedUsers={null} // TOPO -> review
                checkIsSubscribe={checkIsSubscribe}
                checkIsFavorite={checkIsFavorite}
                onDelete={setNoteToDelete}
                handleFavorite={handleFavorite}
              />
            )}
          </>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apuntes
