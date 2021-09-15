import { Grid } from "@chakra-ui/react"
import { pullAt } from "lodash"
import React, { useContext, useEffect, useState } from "react"
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
import useFetchSWR from "../hooks/useFetchSWR"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { ToastContext } from "../provider/ToastProvider"
import { DeleteType } from "../utils/constants/global_config"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"
import { ViewEmptyState } from "../views/common/ViewEmptyState"
import { NewNoteModal } from "../views/notes/NewNote/NewNoteModal/NewNoteModal"
import { NotesMenu } from "../views/notes/NotesMenu/NotesMenu"

const apuntes = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { notes, deleteNote } = useNoteApi()
  const { showToast } = useContext(ToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR(SWR_CACHE_KEYS.notes, notes)

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [noteToUpdate, setNoteToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [notesToDelete, setNotesToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [, /*searchedNotes*/ setSearchedNotes] = useState([])

  const isEmptyData = Boolean(data && data[0]?.notes.length === 0)
  const notesData = data ? data[0]?.notes : []

  // TODO
  const handleExport = () => {}

  // const handleOpenPopup = (notesToDelete, type) => {
  //   setDeleteType(type)
  //   setNotesToDelete(notesToDelete)
  // }

  const handleClosePopup = () => {
    setDeleteType(null)
    setNotesToDelete(null)
  }

  const handleOnOpenModal = () => {
    setIsNoteModalOpen(true)
  }

  const handleOnCloseModal = () => {
    setNoteToUpdate(null)
    setIsNoteModalOpen(false)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(notesToDelete, notesData)
    setDeleteType(null)
    setNotesToDelete(null)
  }

  const getAliasByIdNote = (id) => {
    const { alias } = notesData.find((note) => note._id === id)
    return alias
  }

  const deleteOne = async (id, notes) => {
    await deleteNote(id)
    const updatedNotes = notes.filter((note) => note._id !== id)
    await mutate(updatedNotes, false)
    showToast("Apunte borrado correctamente")
  }

  const deleteMany = async (positions, notes) => {
    const notesQueue = positions.map((position) =>
      deleteNote(notesData[position]._id)
    )
    await Promise.all(notesQueue)
    pullAt(notes, positions)
    const updatedNotes = [...notes]
    await mutate(updatedNotes, false)
    showToast("Apuntes borrados correctamente")
  }

  // const onEdit = (id) => {
  //   const note = [...notesData].find((note) => note._id === id)
  //   setNoteToUpdate(note)
  //   setIsNoteModalOpen(true)
  // }

  const onSearch = (search) => {
    setSearchChain(search)

    if (search === "") return setSearchedNotes([])

    const results = notesData.filter(
      (note) =>
        note._id.toLowerCase().includes(search.toLowerCase()) ||
        note.vtiCode.toLowerCase().includes(search.toLowerCase())
    )
    setSearchedNotes(results)
  }

  useEffect(() => {
    if (isEmptyData || searchChain === "") return
    onSearch(searchChain)
  }, [notesData])

  // * REVIEW
  const [activeTab, setActiveTab] = useState("all")
  const [showNoteDetails, setShowNoteDetails] = useState(null)

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
        isOpen={deleteType}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {deleteType === DeleteType.ONE
          ? `¿Desea eliminar ${getAliasByIdNote(notesToDelete)}?`
          : "¿Desea eliminar los apuntes seleccionados?"}
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
        onClose={() => setShowNoteDetails(null)}
      />

      <PageHeader>
        <BreadCrumbs />
        {!isLoading && !isEmptyData && (
          <ToolBar
            onAdd={handleOnOpenModal}
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
            activeItem={activeTab}
            notesCount={notes?.length}
            onChange={(value) => setActiveTab(value)}
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
                note={note}
                key={`${note.title}-${idx}`}
                onSeeDetails={() => setShowNoteDetails(idx.toString())}
              />
            ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apuntes
