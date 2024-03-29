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
import useUserApi from "../../hooks/api/useUserApi"
import { remove } from "lodash"
import useTableActions from "../../hooks/useTableActions"
import { useMediaQuery } from "@chakra-ui/media-query"
import { TableGrid } from "../../components/tables/TableGrid/TableGrid"
import { Flex, Text } from "@chakra-ui/layout"
import { CloseIcon } from "@chakra-ui/icons"

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
  const [isScreen] = useMediaQuery("(min-width: 475px)")
  const { isLoggedIn, role, user } = useContext(ApiAuthContext)
  const { deleteSystem, createSystem } = useSystemApi()
  const { showToast } = useContext(ToastContext)
  const { updateUser } = useUserApi()

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
  const [queryFilter, setQueryFilter] = useState(null)
  const [queryGroup, setQueryGroup] = useState(null)
  const [querySearch, setQuerySearch] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate, isValidating } = systemFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleSystemsData = (isEmptyData) => {
    if (!data || isEmptyData) return []
    if (fetchState == fetchType.GROUP) return data
    return data[0].testSystems
  }

  const isEmptyData = checkDataIsEmpty(data)
  const systemsData = handleSystemsData(isEmptyData)

  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions(fetchState === fetchType.GROUP)

  const isGrouped = fetchState == fetchType.GROUP

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  // const handleImportSystems = async (data) => {
  //   try {
  //     for (let index = 0; index < data.length; index++) {
  //       await createSystem(data[index])
  //     }

  //     setShowImportModal(false)
  //     showToast({ message: "Sistemas importados correctamente" })
  //   } catch (error) {
  //     errorHandler(error)
  //   }
  // }

  const handleImportSystems = async (data) => {
    for (let index = 0; index < data.length; index++) {
      const system = await createSystem(data[index])
      if (system.error) {
        showToast({
          message: `Ha habido un error en la fila ${
            index + 2
          }. La importación se ha cancelado a partir de esta fila.`,
          time: 5000
        })
        return
      }
    }

    await mutate()

    setShowImportModal(false)
    showToast({ message: "Proyectos importados correctamente" })
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
    // if (fetchState === fetchType.FILTER || queryFilter) handleOnFilter(null)
    // else setShowFilterModal(true)
    setShowFilterModal(true)
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
        showToast({ message: "Proyecto borrado correctamente" })
        return
      }

      await deleteSystem(data)
      showToast({ message: "Sistema borrado correctamente" })

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
      showToast({ message: "Sistemas borrados correctamente" })
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
      const system = systemsData[key].find((system) => system._id === id)
      setSystemToUpdate(system)
    } else {
      const system = systemsData.find((system) => system._id === data)
      setSystemToUpdate(system)
    }

    setIsSystemModalOpen(true)
  }

  const formatUpdateUsersSubscribe = (user, subscribed) => {
    return {
      alias: user.alias,
      name: user.name,
      subscribed,
      department: user.department
    }
  }

  const handleSubscribe = async (data, state) => {
    const { subscribed, _id } = user

    const listToUpdate = subscribed["testSystems"]

    if (isGrouped) {
      const [id] = Object.entries(data)[0]
      if (state) {
        remove(listToUpdate, (e) => e === id)
      } else {
        listToUpdate.push(id)
      }
    } else {
      if (state) {
        remove(listToUpdate, (e) => e === data)
      } else {
        listToUpdate.push(data)
      }
    }

    subscribed["testSystems"] = listToUpdate

    const formatUser = formatUpdateUsersSubscribe(user, subscribed)
    await updateUser(_id, formatUser)
    await mutate()
  }

  // Filters
  const onSearch = (search) => {
    if (!search) {
      if (queryGroup) {
        setFetchState(fetchType.GROUP)
        setFetchOptions({
          [fetchOption.GROUP]: queryGroup
        })
        return
      } else {
        setFetchState(fetchType.ALL)
        setQueryFilter(null)
        setFetchOptions({
          [fetchOption.SEARCH]: null
        })
        return
      }
    }

    setQueryFilter(null)
    setQuerySearch(`testSystems.ref=${search}&testSystems.alias=${search}`)
    let query = `testSystems.ref=${search}&testSystems.alias=${search}`

    if (fetchState === fetchType.GROUP) {
      setFetchState(fetchType.GROUP)
      setFetchOptions({
        [fetchOption.GROUP]: `${queryGroup}&${query}`
      })
    } else {
      setFetchState(fetchType.SEARCH)
      setFetchOptions({
        [fetchOption.SEARCH]: query
      })
    }
  }

  const handleOnGroup = (group) => {
    if (!group) {
      setQueryGroup(null)
      if (queryFilter) {
        setFetchState(fetchType.FILTER)
        setFetchOptions({
          [fetchOption.FILTER]: queryFilter
        })
        return
      } else {
        setFetchState(fetchType.ALL)
        setFetchOptions({
          [fetchOption.GROUP]: null
        })
        return
      }
    }

    setQueryGroup(group)
    let query = group
    if (queryFilter) query = `${query}&${queryFilter}`
    if (querySearch) query = `${query}&${querySearch}`
    setFetchState(fetchType.GROUP)
    setFetchOptions({
      [fetchOption.GROUP]: query
    })
  }

  const handleOnFilter = (values, type) => {
    if (!values) {
      setQueryFilter(null)

      if (queryGroup) {
        setFetchState(fetchType.GROUP)
        setFetchOptions({
          [fetchOption.GROUP]: queryGroup
        })
        return
      } else {
        setFetchState(fetchType.ALL)

        setFetchOptions({
          [fetchOption.FILTER]: null
        })
        return
      }
    }

    let filter = null
    if (type !== "complex") {
      filter = generateFilterQuery(TESTSYSTEMS_FILTER_KEYS, values)
    } else {
      filter = `query=${values}`
    }
    setQuerySearch(null)
    setQueryFilter(filter)

    if (fetchState === fetchType.GROUP) {
      const newGroup = `${queryGroup}&${filter}`
      setFetchState(fetchType.GROUP)
      setFetchOptions({
        [fetchOption.GROUP]: newGroup
      })
    } else {
      setFetchState(fetchType.FILTER)
      setFetchOptions({
        [fetchOption.FILTER]: filter
      })
    }

    setShowFilterModal(false)
  }

  const handleSortElement = (data) => {
    const { name, order } = data

    if (!name || !order) return

    setFetchOptions({
      [fetchOption.ORDER]: `&testSystems_${name}=${order}`
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

      <TestsSystemsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values, type) => handleOnFilter(values, type)}
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
        onUpload={(data) => handleImportSystems(data)}
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
            selectedRows={selectedRows}
          />
        ) : null}
      </PageHeader>
      {isLoading ? (
        <LoadingView mt="-200px" />
      ) : isEmptyData && fetchState !== fetchType.ALL ? (
        <>
          {fetchState === fetchType.FILTER && (
            <Flex
              alignItems="center"
              onClick={() => handleOnFilter(null)}
              cursor="pointer"
              mb="24px"
            >
              <CloseIcon mr="8px" h="12px" />
              <Text marginTop="6px">{`Eliminar filtro`}</Text>
            </Flex>
          )}
          <ViewNotFoundState noBack />
        </>
      ) : isEmptyData && !isValidating ? (
        <ViewEmptyState
          message="Añadir sistemas a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir sistema"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsSystemModalOpen(true)}
        />
      ) : isScreen ? (
        <TestSystemsTable
          fetchState={fetchState}
          systems={systemsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(systemsId) => handleOpenPopup(systemsId, DeleteType.MANY)}
          onEdit={handleUpdate}
          onSubscribe={handleSubscribe}
          onFilter={handleOnFilter}
          onGroup={handleOnGroup}
          groupOption={getGroupOptionLabel(
            SYSTEMS_GROUP_OPTIONS,
            fetchOptions[fetchOption.GROUP]
          )}
          handleSortElement={handleSortElement}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleRowSelect={handleRowSelect}
          handleSelectAllRows={handleSelectAllRows}
        />
      ) : (
        <TableGrid
          fetchState={fetchState}
          items={systemsData}
          onGroup={handleOnGroup}
          onFilter={handleOnFilter}
          groupOption={getGroupOptionLabel(
            SYSTEMS_GROUP_OPTIONS,
            fetchOptions[fetchOption.GROUP]
          )}
          onSubscribe={handleSubscribe}
          type="testSystems"
        />
      )}
    </Page>
  )
}

export default sistemas
