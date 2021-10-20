import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../components/overlay/Popup/Popup"
import useUserApi from "../../hooks/api/useUserApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { DeleteType, RoleType } from "../../utils/constants/global"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { UsersTable } from "../../views/users/UsersTable/UsersTable"
import { NewUserModal } from "../../views/users/NewUser/NewUserModal/NewUserModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { AddUserIcon } from "../../components/icons/AddUserIcon"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { userFetchHandler } from "../../swr/user.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { getGroupOptionLabel } from "../../utils/functions/objects"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import {
  transformUsersToExport,
  userDataTransform
} from "../../utils/functions/import_export/users_helpers"
import { USERS_FILTER_KEYS } from "../../utils/constants/filter"
import { generateFilterQuery } from "../../utils/functions/filter"
import { UsersFilterModal } from "../../views/users/UsersFilter/UsersFilterModal"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"

const USERS_GROUP_OPTIONS = [
  {
    label: "Departamento",
    value: "department.name"
  }
]

const usuarios = () => {
  // Hooks
  const { isLoggedIn, role } = useContext(ApiAuthContext)
  const { deleteUser, createUser } = useUserApi()
  const { showToast } = useContext(ToastContext)

  const isAdmin = role === RoleType.ADMIN

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [usersToDelete, setUsersToDelete] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate } = userFetchHandler(
    fetchState,
    fetchOptions
  )

  const isEmptyData = checkDataIsEmpty(data)
  const usersData = data && !isEmptyData ? data : null

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

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

  const handleOnOpenFilter = () => {
    if (fetchState === fetchType.FILTER) handleOnFilter(null)
    else setShowFilterModal(true)
  }

  // Handlers CRUD
  const handleImportProjects = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      for (let index = 0; index < data.length; index++) {
        await createUser(data[index])
      }

      setShowImportModal(false)
      showToast("Proyectos importados correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportProjects = () => {
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
      showToast("Usuario borrado correctamente")
      return users.filter((user) => user._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (usersId, users) => {
    try {
      const usersQueue = usersId.map((id) => deleteUser(id))
      await Promise.all(usersQueue)
      showToast("Usuarios borrados correctamente")
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
  const handleOnFilter = (values) => {
    if (!values) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.FILTER]: null
      })
      return
    }

    const filter = generateFilterQuery(USERS_FILTER_KEYS, values)

    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })

    setShowFilterModal(false)
  }

  const handleSortElement = (data) => {
    const { name, order } = data

    if (!name || !order) return

    setFetchOptions({
      [fetchOption.ORDER]: `&user_${name}=${order}`
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
        isOpen={deleteType}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
      </Popup>

      <UsersFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values) => handleOnFilter(values)}
      />
      <NewUserModal
        userToUpdate={userToUpdate}
        isOpen={isUserModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportProjects()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportProjects(data)}
        onDropDataTransform={(info) => userDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsUserModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            onFilter={handleOnOpenFilter}
            addLabel="Añadir usuario"
            searchPlaceholder="Busqueda por ID, Alias"
            icon={<AddUserIcon />}
            fetchState={fetchState}
            groupOptions={USERS_GROUP_OPTIONS}
            noAdd={!isAdmin}
            noImport={!isAdmin}
          />
        ) : null}
      </PageHeader>

      {isLoading ? <LoadingView mt="-200px" /> : null}

      {isEmptyData && fetchState !== fetchType.ALL ? (
        <ViewNotFoundState />
      ) : isEmptyData ? (
        <ViewEmptyState
          message="Añadir usuarios a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir usuario"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsUserModalOpen(true)}
        />
      ) : (
        <UsersTable
          fetchState={fetchState}
          users={usersData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(usersId) => handleOpenPopup(usersId, DeleteType.MANY)}
          onEdit={handleUpdate}
          onFilter={handleOnFilter}
          onGroup={handleOnGroup}
          groupOption={getGroupOptionLabel(
            USERS_GROUP_OPTIONS,
            fetchOptions[fetchOption.GROUP]
          )}
          handleSortElement={handleSortElement}
        />
      )}
    </Page>
  )
}

export default usuarios
