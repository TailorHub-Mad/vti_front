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
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { DeleteType } from "../../utils/constants/global"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddTestSystemIcon } from "../../components/icons/AddTestSystemIcon"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { systemFetchHandler } from "../../swr/systems.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { getGroupOptionLabel } from "../../utils/functions/objects"

const SYSTEMS_GROUP_OPTIONS = [
  {
    label: "Cliente",
    value: "client"
  },
  {
    label: "Año",
    value: "date.year"
  },
  {
    label: "CodVTI",
    value: "vtiCode"
  }
]

const sistemas = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteSystem } = useSystemApi()
  const { showToast } = useContext(ToastContext)

  // States

  const [showImportModal, setShowImportModal] = useState(false)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false)
  const [systemToUpdate, setSystemToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [systemsToDelete, setSystemsToDelete] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate } = systemFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleSystemsData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState === fetchType.ALL) return data[0].testSystems
    if (fetchState == fetchType.GROUP) return data
    // TODO FILTER
  }

  const isEmptyData = checkDataIsEmpty(data)
  const systemsData = handleSystemsData(isEmptyData)

  // Handlers views
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

  // Handlers CRUD
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
    updated.testSystems.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setSystemsToDelete(null)
  }

  const deleteOne = async (id, systems) => {
    try {
      await deleteSystem(id)
      showToast("Sistema borrado correctamente")
      const updatedSystems = []
      const filterSystems = systems.filter((system) => system._id !== id)
      updatedSystems.push({
        testSystems: filterSystems
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
      showToast("Sistemas borrados correctamente")
      const updatedSystems = []
      const filterSystems = systems.filter(
        (system) => !systemsId.includes(system._id)
      )
      updatedSystems.push({ testSystems: filterSystems })
      return updatedSystems
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const system = systemsData.find((system) => system._id === id)
    setSystemToUpdate(system)
    setIsSystemModalOpen(true)
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

  const handleOnFilter = (filter) => {
    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
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
            onGroup={handleOnGroup}
            onFilter={handleOnFilter}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir sistema"
            searchPlaceholder="Busqueda por ID, Código"
            groupOptions={SYSTEMS_GROUP_OPTIONS}
            icon={<AddTestSystemIcon />}
            fetchState={fetchState}
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
          fetchState={fetchState}
          systems={systemsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(systemsId) => handleOpenPopup(systemsId, DeleteType.MANY)}
          onEdit={handleUpdate}
          onGroup={handleOnGroup}
          groupOption={getGroupOptionLabel(
            SYSTEMS_GROUP_OPTIONS,
            fetchOptions[fetchOption.GROUP]
          )}
        />
      ) : null}
    </Page>
  )
}

export default sistemas
