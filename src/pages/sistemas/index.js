import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Spinner } from "../../components/spinner/Spinner"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { TestSystemsTable } from "../../views/test_systems/TestSystemsTable/TestSystemsTable"
import useSystemApi from "../../hooks/api/useSystemApi"
import { ToastContext } from "../../provider/ToastProvider"
import { Popup } from "../../components/overlay/Popup/Popup"
import { NewTestSystemModal } from "../../views/test_systems/NewTestSystem/NewTestSystemModal/NewTestSystemModal"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import {
  DeleteType,
  fetchOption,
  fetchType,
} from "../../utils/constants/global_config"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddTestSystemIcon } from "../../components/icons/AddTestSystemIcon"
import { checkDataIsEmpty } from "../../utils/functions/common"
import { systemFetchHandler } from "../../swr/systems.swr"

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

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(systemsToDelete, systemsData)
    setDeleteType(null)
    setSystemsToDelete(null)
  }

  const getAliasByIdSystem = (id) => {
    const system = systemsData?.find((system) => system._id === id)
    return system?.alias
  }

  const deleteOne = async (id, systems) => {
    await deleteSystem(id)
    const updatedSystems = []
    updatedSystems.push({
      testSystems: systems.filter((system) => system._id !== id),
    })
    await mutate(updatedSystems, false)
    showToast("Sistema de ensayo borrado correctamente")
  }

  const deleteMany = async (systemsId, systems) => {
    const systemsQueue = systemsId.map((id) => deleteSystem(id))
    await Promise.all(systemsQueue)
    const updatedSystems = []
    const filteredSystems = systems.filter(
      (system) => !systemsId.includes(system._id)
    )
    updatedSystems.push({ testSystems: filteredSystems })
    await mutate(updatedSystems, false)
    showToast("Sistemas de ensayo borrados correctamente")
  }

  const onEdit = (id) => {
    const system = systemsData.find((system) => system._id === id)
    setSystemToUpdate(system)
    setIsSystemModalOpen(true)
  }

  const onSearch = (search) => {
    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: search,
    })
  }

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
          ? `¿Desea eliminar ${getAliasByIdSystem(systemsToDelete)}?`
          : "¿Desea eliminar los sistemas de ensayo seleccionados?"}
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
      {isLoading ? <Spinner /> : null}
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
