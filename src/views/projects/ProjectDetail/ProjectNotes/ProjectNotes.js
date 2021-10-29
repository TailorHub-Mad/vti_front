import { Flex, Text } from "@chakra-ui/react"
import { remove } from "lodash"
import { useRouter } from "next/router"
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
import { noteFetchHandler } from "../../../../swr/note.swr"
import { NOTES_FILTER_KEYS } from "../../../../utils/constants/filter"
import { PATHS } from "../../../../utils/constants/global"
import {
  fetchOption,
  fetchType,
  SWR_CACHE_KEYS
} from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { generateFilterQuery } from "../../../../utils/functions/filter"
import {
  checkDataIsEmpty,
  getFieldObjectById
} from "../../../../utils/functions/global"
import { getGroupOptionLabel } from "../../../../utils/functions/objects"
import { LoadingView } from "../../../common/LoadingView"
import { ViewNotFoundState } from "../../../common/ViewNotFoundState"
import { NewNoteModal } from "../../../notes/NewNote/NewNoteModal/NewNoteModal"
import { NotesFilterModal } from "../../../notes/NotesFilter/NotesFilterModal"
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

export const ProjectNotes = ({ project }) => {
  const { user } = useContext(ApiAuthContext)
  const { deleteNote, deleteMessage } = useNoteApi()
  const { updateUser } = useUserApi()
  const { showToast } = useContext(ToastContext)
  const { mutate } = useSWRConfig()
  const router = useRouter()

  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [messageToUpdate, setMessageToUpdate] = useState(null)
  const [showNoteDetails, setShowNoteDetails] = useState(false)
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
  const [isFilter, setIsFilter] = useState(false)
  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `notes.projects._id=${project._id}`
  })

  const handleNotesData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState == fetchType.GROUP) return data
    return data[0]?.notes
  }

  const { data, isLoading, isValidating } = noteFetchHandler(
    fetchState,
    fetchOptions
  )

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleNotesData(isEmptyData)

  const isGrouped = fetchState == fetchType.GROUP
  const isSearch = fetchState == fetchType.SEARCH

  const checkIsFavorite = (id) => user?.favorites?.notes?.includes(id)
  const checkIsSubscribe = (id) => user?.subscribed?.notes?.includes(id)

  // Handlers views
  const handleOnOpenFilter = () => {
    if (isFilter) handleOnFilter(null)
    else setShowFilterModal(true)
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
    router.replace(`${PATHS.projects}/[alias]`, {
      pathname: `${PATHS.projects}/${project._id}`,
      query: { note: note?._id }
    })
  }

  const handleOpenEditResponse = (message) => {
    setMessageToUpdate(message)
    setIsResponseModalOpen(true)
  }

  // Handlers CRUD
  const handleDelete = async (noteToDelete) => {
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
        router.replace(`${PATHS.projects}/${project._id}`)
      }
      setNoteToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage(messageToDelete.noteId, messageToDelete.messageId)
      showToast({ message: "Mensaje borrado correctamente" })
      await mutate([SWR_CACHE_KEYS.project, project._id])
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

  const formatUpdateUsers = (user, favorites) => {
    return {
      alias: user.alias,
      name: user.name,
      favorites,
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

    const formatUser = formatUpdateUsers(user, favorites)

    await updateUser(_id, formatUser)
    await mutate([SWR_CACHE_KEYS.project, project._id])
  }

  const formatUpdateUsersSubscribed = (user, subscribed) => {
    return {
      alias: user.alias,
      name: user.name,
      subscribed,
      department: user.department
    }
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
    await mutate([SWR_CACHE_KEYS.project, project._id])
  }

  // Filters
  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.FILTER)
      setIsFilter(false)
      setFetchOptions({
        [fetchOption.FILTER]: `notes.projects._id=${project._id}`
      })
      return
    }

    setIsFilter(true)

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: `notes.title=${search}&notes.ref=${search}&notes.projects._id=${project._id}&union=true`
    })
  }

  const handleOnGroup = (group) => {
    if (!group) {
      setFetchState(fetchType.FILTER)
      setIsFilter(false)
      setFetchOptions({
        [fetchOption.FILTER]: `notes.projects._id=${project._id}`
      })
      return
    }

    setIsFilter(true)

    setFetchState(fetchType.GROUP)
    setFetchOptions({
      [fetchOption.GROUP]: `${group}&notes.projects._id=${project._id}`
    })
  }

  const handleOnFilter = (values) => {
    if (!values) {
      setFetchState(fetchType.FILTER)
      setIsFilter(false)
      setFetchOptions({
        [fetchOption.FILTER]: `notes.projects._id=${project._id}`
      })
      return
    }

    setIsFilter(true)

    const filter = generateFilterQuery(NOTES_FILTER_KEYS, values)

    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: `notes.projects._id=${project._id}&${filter}`
    })

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
    if (!router.query?.note) return

    const noteDetail = notesData?.find((n) => n._id === router.query?.note)
    setNoteToDetail(noteDetail)
    setShowNoteDetails(true)
  }, [])

  console.log(showFilterModal)

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

      <NotesFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values) => handleOnFilter(values)}
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
        onClose={() => {
          setShowNoteDetails(false)
          router.replace(`${PATHS.projects}/${project._id}`)
          setNoteToDetail(null)
        }}
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
        fromProjectDetail={project._id}
      />

      <Flex justify="space-between" align="center" mt="24px">
        <Text variant="d_l_regular">Apuntes</Text>
        <Flex width="fit-content">
          {!isEmptyData ? (
            <ToolBar
              onAdd={() => setIsNoteModalOpen(true)}
              onSearch={onSearch}
              onGroup={handleOnGroup}
              onFilter={handleOnOpenFilter}
              addLabel="Añadir apunte"
              searchPlaceholder="Busqueda por ID, Proyecto"
              groupOptions={NOTES_GROUP_OPTIONS}
              icon={<AddNoteIcon />}
              fetchState={!isFilter ? fetchType.ALL : fetchState}
              noImport
            />
          ) : null}
        </Flex>
      </Flex>
      <PageBody overflowY="none" mt="32px">
        {isLoading ? <LoadingView mt="-400px" /> : null}
        {isEmptyData && isSearch && !isValidating ? (
          <ViewNotFoundState noBack h="40vh" />
        ) : isEmptyData && !isValidating ? (
          <ViewNotFoundState
            text="No hay apuntes asociados a este proyecto"
            h="40vh"
            noBack
          />
        ) : (
          <>
            {fetchState === fetchType.GROUP ? (
              <NotesGroup
                notes={notesData}
                onSeeDetails={handleOpenDetail}
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
                fromProjectDetail
              />
            )}
          </>
        )}
      </PageBody>
    </>
  )
}
