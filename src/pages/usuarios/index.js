import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../components/overlay/Popup/Popup"
import useUserApi from "../../hooks/api/useUserApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { DeleteType } from "../../utils/constants/global"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { UsersTable } from "../../views/users/UsersTable/UsersTable"
import { NewUserModal } from "../../views/users/NewUser/NewUserModal/NewUserModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { UsersLineIcon } from "../../components/icons/UsersLineIcon"
import {
  checkDataIsEmpty,
  generateQueryStr,
  getFieldObjectById
} from "../../utils/functions/global"
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

import { generateFilterQueryObj } from "../../utils/functions/filter"
import { UsersFilterModal } from "../../views/users/UsersFilter/UsersFilterModal"

const USERS_GROUP_OPTIONS = [
  {
    label: "Departamento",
    value: "department"
  }
]

const usuarios = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteUser, createUser } = useUserApi()
  const { showToast } = useContext(ToastContext)

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

  const handleImportProjects = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      const usersCreated = []
      for (let index = 0; index < data.length; index++) {
        const pro = await createUser(data[index])
        usersCreated.push(pro)
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
    console.log(generateQueryStr(generateFilterQueryObj(USERS_FILTER_KEYS, values)))
    // setFetchState(fetchType.FILTER)
    // setFetchOptions({
    //   [fetchOption.FILTER]: filter
    // })
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
        {usersData ? (
          <ToolBar
            onAdd={() => setIsUserModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            onFilter={() => setShowFilterModal(true)}
            addLabel="Añadir usuario"
            searchPlaceholder="Busqueda por ID, Alias"
            icon={<UsersLineIcon />}
            fetchState={fetchState}
            groupOptions={USERS_GROUP_OPTIONS}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {isEmptyData ? (
        <ViewEmptyState
          message="Añadir usuarios a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir usuario"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsUserModalOpen(true)}
        />
      ) : null}
      {usersData ? (
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
      ) : null}
    </Page>
  )
}

export default usuarios
