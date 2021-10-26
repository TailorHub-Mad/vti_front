import React, { useContext, useEffect, useState } from "react"
import { NoteDrawer } from "../../../components/drawer/NoteDrawer/NoteDrawer"
import { AddNoteIcon } from "../../../components/icons/AddNoteIcon"
import { Page } from "../../../components/layout/Pages/Page"
import { PageBody } from "../../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../../../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../../components/overlay/Popup/Popup"
import useNoteApi from "../../../hooks/api/useNoteApi"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { ToastContext } from "../../../provider/ToastProvider"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import {
  checkDataIsEmpty,
  getFieldGRoupObjectById,
  getFieldObjectById
} from "../../../utils/functions/global"
import { LoadingView } from "../../../views/common/LoadingView"
import { ViewNotFoundState } from "../../../views/common/ViewNotFoundState"
import { NewNoteModal } from "../../../views/notes/NewNote/NewNoteModal/NewNoteModal"
import { NotesGrid } from "../../../views/notes/NotesGrid/NotesGrid"
import { NotesGroup } from "../../../views/notes/NotesGroup/NotesGroup"
import { ResponseModal } from "../../../views/notes/Response/ResponseModal/ResponseModal"
import { NotesFilterModal } from "../../../views/notes/NotesFilter/NotesFilterModal"
import { NOTES_FILTER_KEYS } from "../../../utils/constants/filter"
import { generateFilterQuery } from "../../../utils/functions/filter"
import { getGroupOptionLabel } from "../../../utils/functions/objects"
import { useRouter } from "next/router"
import { projectFetchHandler } from "../../../swr/project.swr"
import { PATHS } from "../../../utils/constants/global"
import { systemFetchHandler } from "../../../swr/systems.swr"

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

const apuntesSuscripciones = () => {
  // Hooks
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteNote, deleteMessage } = useNoteApi()
  const { showToast } = useContext(ToastContext)

  const {
    query: { type: typeObject }
  } = router

  // States
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

  const fetcher =
    typeObject === "projects" ? projectFetchHandler : systemFetchHandler

  const { data, error, isLoading, mutate } = fetcher(fetchType.ID, {
    [fetchOption.ID]: router.query.object
  })

  const handleNotesData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState == fetchType.GROUP) return data
    const { projects, testSystems } = data[0]
    const { notes } = typeObject === "projects" ? projects[0] : testSystems[0]
    return notes.map((n) => {
      return {
        ...n,
        projects:
          typeObject === "projects"
            ? [{ alias: data[0]?.projects[0].alias }]
            : [{ alias: "" }]
      }
    })
  }

  const isEmptyData = checkDataIsEmpty(data)
  const notesData = handleNotesData(isEmptyData)

  const isGrouped = fetchState == fetchType.GROUP

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleOnCloseModal = () => {
    setNoteToUpdate(null)
    setIsNoteModalOpen(false)
  }

  const handleOpenEditResponse = (message) => {
    setMessageToUpdate(message)
    setIsResponseModalOpen(true)
  }

  const handleOnOpenFilter = () => {
    if (fetchState === fetchType.FILTER) handleOnFilter(null)
    else setShowFilterModal(true)
  }

  // Handlers CRUD
  const handleDeleteMessageToNote = () => {
    if (!noteToDelete) return

    const label = isGrouped
      ? getFieldGRoupObjectById(notesData, "name", noteToDelete.id, noteToDelete.key)
      : getFieldObjectById(notesData, "name", noteToDelete)
    return `¿Desea eliminar ${label}?`
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

      updatedNotes[0].notes.length > 0
        ? await mutate(updatedNotes, false)
        : await mutate()

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
    if (!values) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.FILTER]: null
      })
      return
    }

    const filter = generateFilterQuery(NOTES_FILTER_KEYS, values)

    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })

    setShowFilterModal(false)
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

      <NoteDrawer
        note={noteToDetail}
        isOpen={showNoteDetails}
        onClose={() => {
          setShowNoteDetails(false)
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
      />

      <PageHeader>
        <BreadCrumbs
          customURL={`${PATHS.subscriptions}/${router.query.owner}`}
          lastElement={`/${
            typeObject === "projects" ? "Proyectos" : "Sistemas ensayo"
          }/apuntes`}
        />
        {isToolbarHidden() && (
          <ToolBar
            onAdd={() => setIsNoteModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={handleOnOpenFilter}
            addLabel="Añadir apunte"
            searchPlaceholder="Busqueda por ID, Proyecto"
            groupOptions={NOTES_GROUP_OPTIONS}
            icon={<AddNoteIcon />}
            fetchState={fetchState}
            noImport
            noAdd
            noFilter
            noGroup
          />
        )}
      </PageHeader>
      <PageMenu></PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData ? (
          <ViewNotFoundState noBack text="No hay apuntes asociados" />
        ) : (
          <>
            {fetchState === fetchType.GROUP ? (
              <NotesGroup
                notes={notesData}
                onSeeDetails={() => {}}
                checkIsSubscribe={() => {}}
                checkIsFavorite={() => {}}
                onDelete={() => {}}
                handleFavorite={() => {}}
                handleSubscribe={() => {}}
                notesFromSubscription
                onGroup={handleOnGroup}
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
                onSeeDetails={() => {}}
                checkIsSubscribe={() => {}}
                checkIsFavorite={() => {}}
                onDelete={() => {}}
                handleFavorite={() => {}}
                handleSubscribe={() => {}}
                notesFromSubscription
              />
            )}
          </>
        )}
      </PageBody>
    </Page>
  )
}

export default apuntesSuscripciones
