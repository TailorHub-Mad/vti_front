import download from "downloadjs"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { jsonToCSV } from "react-papaparse"
import { useSWRConfig } from "swr"
import { UsersLineIcon } from "../../../components/icons/UsersLineIcon"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import { ExportFilesModal } from "../../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { ImportFilesModal } from "../../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../../components/overlay/Popup/Popup"
import useUserApi from "../../../hooks/api/useUserApi"
import { ToastContext } from "../../../provider/ToastProvider"
import { DeleteType } from "../../../utils/constants/global"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import { getFieldObjectById } from "../../../utils/functions/global"
import {
  transformUsersToExport,
  userDataTransform
} from "../../../utils/functions/import_export/users_helpers"
import { getGroupOptionLabel } from "../../../utils/functions/objects"
import { ViewNotFoundState } from "../../common/ViewNotFoundState"
import { NewUserModal } from "../NewUser/NewUserModal/NewUserModal"
import { UsersTable } from "../UsersTable/UsersTable"

const USERS_GROUP_OPTIONS = [
  {
    label: "Departamento",
    value: "department"
  }
]

export const UsersByObject = ({
  usersData,
  customURL,
  fetchState,
  setFetchState,
  fetchOptions,
  setFetchOptions,
  isEmptyData,
  hrefBack,
  backText
}) => {
  // Hooks
  const { deleteUser, createUser } = useUserApi()
  const { showToast } = useContext(ToastContext)
  const { mutate } = useSWRConfig()
  const router = useRouter()

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [usersToDelete, setUsersToDelete] = useState(null)

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleOpenPopup = (usersToDelete, type) => {
    setDeleteType(type)
    setUsersToDelete(usersToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setUsersToDelete(null)
  }

  const handleOnCloseModal = () => {
    setUserToUpdate(null)
    setIsUserModalOpen(false)
  }

  // Handlers CRUD
  const handleImportUsers = async (data) => {
    try {
      for (let index = 0; index < data.length; index++) {
        await createUser(data[index])
      }

      setShowImportModal(false)
      showToast({ message: "Proyectos importados correctamente" })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportUsers = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformUsersToExport(usersData))
    download(_data, `users_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleDeleteMessage = () => {
    if (!usersToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los usuarios seleccionados?"
    const label = getFieldObjectById(usersData, "alias", usersToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(usersToDelete, usersData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setUsersToDelete(null)
  }

  const deleteOne = async (id, users) => {
    try {
      await deleteUser(id)
      showToast({ message: "Usuario borrado correctamente" })
      return users.filter((user) => user._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (usersId, users) => {
    try {
      const usersQueue = usersId.map((id) => deleteUser(id))
      await Promise.all(usersQueue)
      showToast({ message: "Usuarios borrados correctamente" })
      return users.filter((user) => !usersId.includes(user._id))
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const user = usersData.find((user) => user._id === id)
    setUserToUpdate(user)
    setIsUserModalOpen(true)
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

  return (
    <>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={deleteType}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
      </Popup>

      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={deleteType}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
      </Popup>

      <NewUserModal
        userToUpdate={userToUpdate}
        isOpen={isUserModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportUsers()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportUsers(data)}
        onDropDataTransform={(info) => userDataTransform(info)}
      />

      <PageHeader>
        {usersData ? (
          <BreadCrumbs customURL={customURL} lastElement="Usuarios" />
        ) : null}

        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsUserModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir usuario"
            searchPlaceholder="Busqueda por ID, Alias"
            groupOptions={USERS_GROUP_OPTIONS}
            icon={<UsersLineIcon />}
            fetchState={fetchState}
            noImport
            noGroup
            noFilter
          />
        ) : null}
      </PageHeader>
      {isEmptyData ? (
        <ViewNotFoundState
          text="No hay usuarios asociados"
          backText={backText}
          onClick={() => router.push(hrefBack)}
        />
      ) : (
        <UsersTable
          fetchState={fetchState}
          users={usersData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(usersId) => handleOpenPopup(usersId, DeleteType.MANY)}
          onEdit={handleUpdate}
          onGroup={handleOnGroup}
          groupOption={getGroupOptionLabel(
            USERS_GROUP_OPTIONS,
            fetchOptions[fetchOption.GROUP]
          )}
        />
      )}
    </>
  )
}
