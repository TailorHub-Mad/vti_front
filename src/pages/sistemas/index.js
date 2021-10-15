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
import { DeleteType, RoleType } from "../../utils/constants/global"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddTestSystemIcon } from "../../components/icons/AddTestSystemIcon"
import {
  checkDataIsEmpty,
  getFieldGRoupObjectById,
  getFieldObjectById
} from "../../utils/functions/global"
import { systemFetchHandler } from "../../swr/systems.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { getGroupOptionLabel } from "../../utils/functions/objects"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"
import {
  testSystemDataTransform,
  transformTestSystemsToExport
} from "../../utils/functions/import_export/testSystem_helpers"
import { generateFilterQuery } from "../../utils/functions/filter"
import { TESTSYSTEMS_FILTER_KEYS } from "../../utils/constants/filter"
import { TestsSystemsFilterModal } from "../../views/test_systems/TestSystemsFilter/TestSystemsFilterModal"

const SYSTEMS_GROUP_OPTIONS = [
  {
    label: "Cliente",
    value: "clientAlias"
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
  const { isLoggedIn, role } = useContext(ApiAuthContext)
  const { deleteSystem, createSystem } = useSystemApi()
  const { showToast } = useContext(ToastContext)

  const isAdmin = role === RoleType.ADMIN

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)

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
    if (fetchState == fetchType.GROUP) return data
    return data[0].testSystems

    // TODO FILTER
  }

  const isEmptyData = checkDataIsEmpty(data)
  const systemsData = handleSystemsData(isEmptyData)

  const isGrouped = fetchState == fetchType.GROUP

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleImportProjects = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      for (let index = 0; index < data.length; index++) {
        await createSystem(data[index])
      }

      setShowImportModal(false)
      showToast("Sistemas importados correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportProjects = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformTestSystemsToExport(systemsData))
    download(_data, `sistemas_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  const handleOpenPopup = (systemsToDelete, type) => {
    setDeleteType(type)

    if (type === DeleteType.ONE && isGrouped) {
      const [id, { key }] = Object.entries(systemsToDelete)[0]
      return setSystemsToDelete({ id, key })
    }
    return setSystemsToDelete(systemsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setSystemsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setSystemToUpdate(null)
    setIsSystemModalOpen(false)
  }

  const handleOnOpenFilter = () => {
    if (fetchState === fetchType.FILTER) handleOnFilter(null)
    else setShowFilterModal(true)
  }

  // Handlers CRUD
  const handleDeleteMessage = () => {
    if (!systemsToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los proyectos seleccionados?"

    const label = isGrouped
      ? getFieldGRoupObjectById(
          systemsData,
          "alias",
          systemsToDelete.id,
          systemsToDelete.key
        )
      : getFieldObjectById(systemsData, "alias", systemsToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(systemsToDelete, systemsData)

    setDeleteType(null)
    setSystemsToDelete(null)
    if (isGrouped || updated[0].testSystems.length === 0) return await mutate()
    await mutate(updated, false)
  }

  const deleteOne = async (data, systems) => {
    try {
      if (isGrouped) {
        await deleteSystem(data.id)
        showToast("Proyecto borrado correctamente")
        return
      }

      await deleteSystem(data)
      showToast("Sistema borrado correctamente")

      const filterSystems = systems.filter((system) => system._id !== data)
      return [
        {
          testSystems: filterSystems
        }
      ]
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (systemsId, systems) => {
    try {
      const systemsQueue = systemsId.map((id) => deleteSystem(id))
      await Promise.all(systemsQueue)
      showToast("Sistemas borrados correctamente")
      const filterSystems = systems.filter(
        (system) => !systemsId.includes(system._id)
      )
      return [{ testSystems: filterSystems }]
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (data) => {
    if (isGrouped) {
      const [id, { key }] = Object.entries(data)[0]
      const project = systemsData[key].find((project) => project._id === id)
      setSystemToUpdate(project)
    } else {
      const project = systemsData.find((project) => project._id === data)
      setSystemToUpdate(project)
    }

    setIsSystemModalOpen(true)
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

    const filter = generateFilterQuery(TESTSYSTEMS_FILTER_KEYS, values)

    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })

    setShowFilterModal(false)
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

      <TestsSystemsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values) => handleOnFilter(values)}
      />

      <NewTestSystemModal
        systemToUpdate={systemToUpdate}
        isOpen={isSystemModalOpen}
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
        onDropDataTransform={(info) => testSystemDataTransform(info)}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsSystemModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={handleOnOpenFilter}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir sistema"
            searchPlaceholder="Busqueda por ID, Código"
            groupOptions={SYSTEMS_GROUP_OPTIONS}
            icon={<AddTestSystemIcon />}
            fetchState={fetchState}
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
