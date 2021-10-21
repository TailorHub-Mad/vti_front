import { Flex, Text } from "@chakra-ui/react"
import { remove } from "lodash"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { NoteDrawer } from "../../../../components/drawer/NoteDrawer/NoteDrawer"
import { AddNoteIcon } from "../../../../components/icons/AddNoteIcon"
import { PageBody } from "../../../../components/layout/Pages/PageBody/PageBody"
import { ToolBar } from "../../../../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../../../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../../../components/overlay/Popup/Popup"
import useNoteApi from "../../../../hooks/api/useNoteApi"
import useUserApi from "../../../../hooks/api/useUserApi"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { ToastContext } from "../../../../provider/ToastProvider"
import {
  fetchOption,
  fetchType,
  SWR_CACHE_KEYS
} from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import {
  checkDataIsEmpty,
  getFieldObjectById
} from "../../../../utils/functions/global"
import { LoadingView } from "../../../common/LoadingView"
import { ViewNotFoundState } from "../../../common/ViewNotFoundState"
import { NewNoteModal } from "../../../notes/NewNote/NewNoteModal/NewNoteModal"
import { NotesGrid } from "../../../notes/NotesGrid/NotesGrid"
import { NotesGroup } from "../../../notes/NotesGroup/NotesGroup"
import { ResponseModal } from "../../../notes/Response/ResponseModal/ResponseModal"

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

export const ProjectNotes = ({ notesData = [], project, onGroup, onFilter }) => {
  const { user } = useContext(ApiAuthContext)
  const { deleteNote, deleteMessage } = useNoteApi()
  const { updateUser } = useUserApi()
  const { showToast } = useContext(ToastContext)
  const { mutate } = useSWRConfig()

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [messageToDelete, setMessageToDelete] = useState(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [messageToUpdate, setMessageToUpdate] = useState(null)
  const [showNoteDetails, setShowNoteDetails] = useState(false)
  const [, /*fetchOptions*/ setFetchOptions] = useState({})
  const [noteFromProject] = useState({
    project: {
      label: project.alias,
      value: project._id
    },
    testSystems: project.testSystems.map((ts) => ({
      label: ts.alias,
      value: ts._id
    }))
  })
  const [noteToUpdate, setNoteToUpdate] = useState(null)
  const [noteToDetail, setNoteToDetail] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)

  // ************ PROVISIONAL
  const isLoading = false // TODO -> provisional

  const isEmptyData = checkDataIsEmpty(notesData)
  const isSearch = fetchState == fetchType.SEARCH
  // PROVISIONAL *****************

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
  const handleDelete = async (noteToDelete) => {
    try {
      await deleteNote(noteToDelete)
      showToast("Apunte borrado correctamente")
      await mutate([SWR_CACHE_KEYS.project, project._id])
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
    // TODO -> create full notes
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

  return (
    <>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={noteToDelete}
        onConfirm={() => handleDelete(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
      >
        {`¿Desea eliminar ${getFieldObjectById(notesData, "ref", noteToDelete)}?`}
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

      <ResponseModal
        messageToUpdate={messageToUpdate}
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        noteId={noteToDetail?._id}
      />

      <NewNoteModal
        noteToUpdate={noteToUpdate}
        noteFromProject={noteFromProject}
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
        onDeleteResponse={(noteId, messageId) =>
          setMessageToDelete({
            noteId,
            messageId
          })
        }
      />

      <Flex justify="space-between" align="center" mt="24px" mb="24px">
        <Text variant="d_l_regular">Apuntes</Text>
        <Flex width="fit-content">
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
            noFilter={Boolean(notesData)}
            noGroup={Boolean(notesData)}
            noSearch={Boolean(notesData)}
            noImport
          />
        </Flex>
      </Flex>
      <PageBody h={"calc(100vh - 400px)"} overflowY="none">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData && isSearch ? (
          <ViewNotFoundState />
        ) : isEmptyData ? (
          <ViewNotFoundState text="No hay apuntes asociados" h="40vh" noBack />
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
                onGroup={onGroup}
                onFilter={onFilter}
              />
            ) : (
              <NotesGrid
                notes={notesData}
                onSeeDetails={handleOpenDetail}
                subscribedUsers={null} // TOPO -> review
                checkIsSubscribe={checkIsSubscribe}
                checkIsFavorite={checkIsFavorite}
                onDelete={(id) => setNoteToDelete(id)}
                handleFavorite={handleFavorite}
              />
            )}
          </>
        ) : null}
      </PageBody>
    </>
  )
}
