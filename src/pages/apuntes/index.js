import React, { useContext, useEffect, useState } from "react"
import { NoteDrawer } from "../../components/drawer/NoteDrawer/NoteDrawer"
import { AddNoteIcon } from "../../components/icons/AddNoteIcon"
import { Page } from "../../components/layout/Pages/Page"
import { PageBody } from "../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../components/overlay/Popup/Popup"
import useNoteApi from "../../hooks/api/useNoteApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { noteFetchHandler } from "../../swr/note.swr"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { errorHandler } from "../../utils/errors"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { LoadingView } from "../../views/common/LoadingView"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { NewNoteModal } from "../../views/notes/NewNote/NewNoteModal/NewNoteModal"
import { NotesGrid } from "../../views/notes/NotesGrid/NotesGrid"
import { NotesGroup } from "../../views/notes/NotesGroup/NotesGroup"
import { NotesMenu } from "../../views/notes/NotesMenu/NotesMenu"
import { ResponseModal } from "../../views/notes/Response/ResponseModal/ResponseModal"

const NOTES_GROUP_OPTIONS = [
  {
    label: "Proyecto",
    value: "title"
  },
  {
    label: "Año",
    value: "date.year"
  },
  {
    label: "Sector",
    value: "sector.0.title"
  },
  {
    label: "Tags de apunte",
    value: "notes.tags.name"
  }
]

const apuntes = () => {
  // Hooks
  const { isLoggedIn, user } = useContext(ApiAuthContext)
  const { deleteNote } = useNoteApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [messageToUpdate, setMessageToUpdate] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showNoteDetails, setShowNoteDetails] = useState(false)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteToUpdate, setNoteToUpdate] = useState(null)
  const [noteToDetail, setNoteToDetail] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate } = noteFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleNotesData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState === fetchType.ALL) return data[0].notes
    if (fetchState == fetchType.GROUP) return data
    // TODO FILTER
  }

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleNotesData(isEmptyData)

  const checkIsFavorite = (id) => user?.favorites?.notes?.includes(id)
  const checkIsSubscribe = (id) => user?.subscribed?.notes?.includes(id)

  // Handlers views
  const handleExport = () => {}

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
  const handleDelete = async () => {
    try {
      await deleteNote(noteToDelete)
      showToast("Apunte borrado correctamente")
      const updatedNotes = notesData.filter((system) => system._id !== noteToDelete)
      updatedNotes.length > 0 ? await mutate(updatedNotes, false) : await mutate()
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    // TODO -> create full notes
    const note = notesData.find((note) => note._id === id)
    console.log("HandleEdit", id, note)
    setNoteToUpdate(note)
    setIsNoteModalOpen(true)
  }

  const handleFavorite = async (id) => {
    // TOD -> update users
    console.log("HandleFavorite", id)
  }

  // Filters
  const onSearch = (search) => {
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

  const handleOnFilter = (filter) => {
    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })
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
        {`¿Desea eliminar ${getFieldObjectById(notesData, "ref", noteToDelete)}?`}
      </Popup>

      <ResponseModal
        messageToUpdate={messageToUpdate}
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        noteId={noteToDetail?._id}
      />

      <NewNoteModal
        clientToUpdate={noteToUpdate}
        isOpen={isNoteModalOpen}
        onClose={handleOnCloseModal}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <NoteDrawer
        note={noteToDetail}
        isOpen={showNoteDetails}
        onClose={() => setShowNoteDetails(false)}
        onDelete={() => setNoteToDelete(noteToDetail._id)}
        onEdit={() => handleUpdate(noteToDetail._id)}
        onResponse={() => setIsResponseModalOpen(true)}
        onEditResponse={(message) => handleOpenEditResponse(message)}
      />

      <PageHeader>
        <BreadCrumbs />
        {!isLoading && !isEmptyData && (
          <ToolBar
            onAdd={() => setIsNoteModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={handleOnFilter}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir apunte"
            searchPlaceholder="Busqueda por ID, Proyecto"
            groupOptions={NOTES_GROUP_OPTIONS}
            icon={<AddNoteIcon />}
            fetchState={fetchState}
          />
        )}
      </PageHeader>
      <PageMenu>
        {notesData ? (
          <NotesMenu
            fetchState={fetchState}
            notesCount={notesData?.length}
            onChange={(state) => setFetchState(state)}
          />
        ) : null}
      </PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData ? (
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
                onDelete={setNoteToDelete}
                handleFavorite={handleFavorite}
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
