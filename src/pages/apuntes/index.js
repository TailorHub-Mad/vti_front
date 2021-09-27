import { Grid } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { MessageCard } from "../../components/cards/MessageCard/MessageCard"
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
import { NotesMenu } from "../../views/notes/NotesMenu/NotesMenu"

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
  const { deleteNote } = useNoteApi()
  const { showToast } = useContext(ToastContext)

  // States
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
        {notesData && !isEmptyData ? (
          <NotesMenu
            activeItem={fetchState}
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
                onSeeDetails={() => handleOpenDetail(note)}
                subscribedUsers={null} // TOPO -> review
                isSubscribe={checkIsSubscribe(note._id)}
                isFavorite={checkIsFavorite(note._id)}
                onDelete={() => setNoteToDelete(note._id)}
                handleFavorite={() => handleFavorite(note._id)}
              />
            ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apuntes
