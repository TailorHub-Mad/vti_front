import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../components/overlay/Popup/Popup"
import useUserApi from "../../hooks/api/useUserApi"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { DeleteType, fetchOption, fetchType } from "../../utils/constants/global"
import { UsersTable } from "../../views/users/UsersTable/UsersTable"
import { NewUserModal } from "../../views/users/NewUser/NewUserModal/NewUserModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { UsersLineIcon } from "../../components/icons/UsersLineIcon"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { userFetchHandler } from "../../swr/user.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"

const usuarios = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteUser } = useUserApi()
  const { showToast } = useContext(ToastContext)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const { data, error, isLoading, mutate } = userFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [userToUpdate, setUserToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [usersToDelete, setUsersToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const usersData = data && !isEmptyData ? data : null

  // TODO
  const handleExport = () => {}

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

  const onEdit = (id) => {
    const user = usersData.find((user) => user._id === id)
    setUserToUpdate(user)
    setIsUserModalOpen(true)
  }

  const onSearch = (search) => {
    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: search
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

      <NewUserModal
        userToUpdate={userToUpdate}
        isOpen={isUserModalOpen}
        onClose={handleOnCloseModal}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader>
        <BreadCrumbs />
        {usersData ? (
          <ToolBar
            onAdd={() => setIsUserModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir usuario"
            searchPlaceholder="Busqueda por ID, Alias"
            noFilter
            noGroup
            icon={<UsersLineIcon />}
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
          users={usersData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(usersId) => handleOpenPopup(usersId, DeleteType.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default usuarios
