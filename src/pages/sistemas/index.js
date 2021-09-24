import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { TestSystemsTable } from "../../views/test_systems/TestSystemsTable/TestSystemsTable"
import useSystemApi from "../../hooks/api/useSystemApi"
import { ToastContext } from "../../provider/ToastProvider"
import { Popup } from "../../components/overlay/Popup/Popup"
import { NewTestSystemModal } from "../../views/test_systems/NewTestSystem/NewTestSystemModal/NewTestSystemModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { DeleteType, fetchOption, fetchType } from "../../utils/constants/global"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddTestSystemIcon } from "../../components/icons/AddTestSystemIcon"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { systemFetchHandler } from "../../swr/systems.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"

const sistemas = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteSystem } = useSystemApi()
  const { showToast } = useContext(ToastContext)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  const { data, error, isLoading, mutate } = systemFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false)
  const [systemToUpdate, setSystemToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [systemsToDelete, setSystemsToDelete] = useState(null)

  const isEmptyData = checkDataIsEmpty(data)
  const systemsData = data && !isEmptyData ? data[0].testSystems : null

  // TODO
  const handleExport = () => {}

  const handleOpenPopup = (systemsToDelete, type) => {
    setDeleteType(type)
    setSystemsToDelete(systemsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setSystemsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setSystemToUpdate(null)
    setIsSystemModalOpen(false)
  }

  const handleDeleteMessage = () => {
    if (!systemsToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los sistemas seleccionados?"
    const label = getFieldObjectById(systemsData, "alias", systemsToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(systemsToDelete, systemsData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setSystemsToDelete(null)
  }

  const deleteOne = async (id, systems) => {
    try {
      await deleteSystem(id)
      showToast("Sistema borrado correctamente")
      const updatedSystems = []
      const filteredSystems = systems.filter((system) => system._id !== id)
      updatedSystems.push({
        testSystems: filteredSystems
      })
      return updatedSystems
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (systemsId, systems) => {
    try {
      const systemsQueue = systemsId.map((id) => deleteSystem(id))
      await Promise.all(systemsQueue)
      showToast("Clientes borrados correctamente")
      const updatedSystems = []
      const filteredSystems = systems.filter(
        (system) => !systemsId.includes(system._id)
      )
      updatedSystems.push({ testSystems: filteredSystems })
      return filteredSystems
    } catch (error) {
      errorHandler(error)
    }
  }

  const onEdit = (id) => {
    const system = systemsData.find((system) => system._id === id)
    setSystemToUpdate(system)
    setIsSystemModalOpen(true)
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

      <NewTestSystemModal
        systemToUpdate={systemToUpdate}
        isOpen={isSystemModalOpen}
        onClose={handleOnCloseModal}
      />
      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader>
        <BreadCrumbs />
        {systemsData ? (
          <ToolBar
            onAdd={() => setIsSystemModalOpen(true)}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir sistema"
            searchPlaceholder="Busqueda por ID, Código"
            icon={<AddTestSystemIcon />}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {isEmptyData ? (
        <ViewEmptyState
          message="Añadir sistemas a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir sistema"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsSystemModalOpen(true)}
        />
      ) : null}
      {systemsData ? (
        <TestSystemsTable
          systems={systemsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(systemsId) => handleOpenPopup(systemsId, DeleteType.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default sistemas
