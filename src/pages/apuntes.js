import { Grid } from "@chakra-ui/react"
import { remove } from "lodash"
import React, { useContext, useState } from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { NoteDrawer } from "../components/drawer/NoteDrawer/NoteDrawer"
import { AddNoteIcon } from "../components/icons/AddNoteIcon"
import { Page } from "../components/layout/Pages/Page"
import { PageBody } from "../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../components/overlay/Popup/Popup"
import { Spinner } from "../components/spinner/Spinner"
import useNoteApi from "../hooks/api/useNoteApi"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { ToastContext } from "../provider/ToastProvider"
import { noteFetchHandler } from "../swr/note.swr"
import { fetchOption, fetchType } from "../utils/constants/global_config"
import { checkDataIsEmpty } from "../utils/functions/common"
import { ViewEmptyState } from "../views/common/ViewEmptyState"
import { NewNoteModal } from "../views/notes/NewNote/NewNoteModal/NewNoteModal"
import { NotesMenu } from "../views/notes/NotesMenu/NotesMenu"

const apuntes = () => {
  const { isLoggedIn, user } = useContext(ApiAuthContext)
  const { notes, deleteNote } = useNoteApi()
  const { showToast } = useContext(ToastContext)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const { data, error, isLoading, mutate } = noteFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)
  const [showNoteDetails, setShowNoteDetails] = useState(false)

  // Create - Update state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteToUpdate, setNoteToUpdate] = useState(null)

  const [noteToDelete, setNoteToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = data ? data[0]?.notes : []

  // TODO
  const handleExport = () => {}

  const handleOnCloseModal = () => {
    setNoteToUpdate(null)
    setIsNoteModalOpen(false)
  }

  const getTitleByIdNote = (id) => {
    if (!id) return
    const { title } = notesData.find((note) => note._id === id)
    return title
  }

  const handleDelete = async (id) => {
    await deleteNote(id)
    const updatedNotes = remove(notes, (note) => note._id === id)
    await mutate(updatedNotes, false)
    setNoteToDelete(null)
    showToast("Apunte borrado correctamente")
  }

  // TODO
  const handleFavorite = async (/*id*/) => {}

  const checkIsFavorite = (id) => user.favorites.notes.includes(id)
  const checkIsSubscribe = (id) => user.subscribed.notes.includes(id)

  // const onEdit = (id) => {
  //   const note = notesData.find((note) => note._id === id)
  //   setNoteToUpdate(note)
  //   setIsNoteModalOpen(true)
  // }

  const onSearch = (search) =>
    setFetchOptions({
      [fetchOption.SEARCH]: search
    })

  if (error) return <>ERROR...</>
  return !isLoggedIn ? (
    <>Loading...</>
  ) : (
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
        {`¿Desea eliminar ${getTitleByIdNote(noteToDelete)}?`}
      </Popup>

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
        isOpen={showNoteDetails}
        onClose={() => setShowNoteDetails(false)}
      />

      <PageHeader>
        <BreadCrumbs />
        {!isLoading && !isEmptyData && (
          <ToolBar
            onAdd={() => setIsNoteModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir apunte"
            searchPlaceholder="Busqueda por ID, Proyecto"
            withoutFilter
            withoutGroup
            icon={<AddNoteIcon />}
          />
        )}
      </PageHeader>
      <PageMenu>
        {notesData && !isEmptyData ? (
          <NotesMenu
            activeItem={fetchState}
            notesCount={notes?.length}
            onChange={(state) => setFetchState(state)}
          />
        ) : null}
      </PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <Spinner /> : null}
        {isEmptyData ? (
          <ViewEmptyState
            message="Añadir clientes a la plataforma"
            importButtonText="Importar"
            addButtonText="Añadir cliente"
            onImport={() => setShowImportModal(true)}
            onAdd={() => setIsNoteModalOpen(true)}
          />
        ) : null}
        {notesData && !isEmptyData ? (
          <Grid
            templateColumns="repeat(auto-fill, 282px)"
            gap="16px"
            width="100%"
            marginBottom="32px"
          >
            {notesData.map((note, idx) => (
              <MessageCard
                key={`${note.title}-${idx}`}
                note={note}
                onSeeDetails={() => setShowNoteDetails(true)}
                subscribedUsers={null} // TOPO -> review
                isSubscribe={checkIsSubscribe(note._id)}
                isFavorite={checkIsFavorite(note._id)}
                handleDelete={() => setNoteToDelete(idx)}
                handleFavorite={() => handleFavorite(idx)}
              />
            ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apuntes
