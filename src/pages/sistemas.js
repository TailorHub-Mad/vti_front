import { useContext, useEffect, useState } from "react"
import { Page } from "../components/layout/Page/Page"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import { ApiUserContext } from "../provider/ApiAuthProvider"
import { TestSystemsEmptyState } from "../views/test_systems/TestSystemsEmptyState/TestSystemsEmptyState"
import { TestSystemsTable } from "../views/test_systems/TestSystemsTable/TestSystemsTable"
import { TestSystemsToolbar } from "../views/test_systems/TestSystemsToolbar/TestSystemsToolbar"
import useSystemApi from "../hooks/api/useSystemsApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { ApiToastContext } from "../provider/ApiToastProvider"
import { Popup } from "../components/overlay/Popup/Popup"
import { pullAt } from "lodash"
import { NewTestSystemModal } from "../views/test_systems/TestSystemsToolbar/NewTestSystem/NewTestSystemModal/NewTestSystemModal"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"
import { ImportFilesModal } from "../views/common/ImportFilesModal/ImportFilesModal"

const DeleteType = {
  ONE: "deleteOne",
  MANY: "deleteMany",
}

const sistemas = () => {
  const { isLoggedIn } = useContext(ApiUserContext)
  const { systems, deleteSystem } = useSystemApi()
  const { showToast } = useContext(ApiToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR(
    SWR_CACHE_KEYS.systems,
    systems
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false)
  const [systemToEdit, setSystemToEdit] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [systemsToDelete, setSystemsToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [searchedSystems, setSearchedSystems] = useState([])

  const emptyData = Boolean(data && data[0]?.testSystems.length === 0)
  const systemsData = data ? data[0]?.testSystems : []

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

  const handleOnOpenModal = () => {
    setIsSystemModalOpen(true)
  }

  const handleOnCloseModal = () => {
    setSystemToEdit(null)
    setIsSystemModalOpen(false)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(systemsToDelete, systemsData)
    setDeleteType(null)
    setSystemsToDelete(null)
  }

  const getAliasByIdSystem = (id) => {
    const { alias } = systemsData.find((system) => system._id === id)
    return alias
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

  const deleteMany = async (positions, systems) => {
    const systemsQueue = positions.map((position) =>
      deleteSystem(systemsData[position]._id)
    )
    await Promise.all(systemsQueue)
    pullAt(systems, positions)
    const updatedSystems = []
    updatedSystems.push({ testSystems: systems })
    await mutate(updatedSystems, false)
    showToast("Sistemas de ensayo borrados correctamente")
  }

  const onEdit = (id) => {
    const system = [...systemsData].find((system) => system._id === id)
    setSystemToEdit(system)
    setIsSystemModalOpen(true)
  }

  const onSearch = (search) => {
    setSearchChain(search)

    if (search === "") return setSearchedSystems([])

    const results = systemsData.filter(
      (system) =>
        system._id.toLowerCase().includes(search.toLowerCase()) ||
        system.vtiCode.toLowerCase().includes(search.toLowerCase())
    )
    setSearchedSystems(results)
  }

  useEffect(() => {
    if (emptyData || searchChain === "") return
    onSearch(searchChain)
  }, [data])

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
        systemToEdit={systemToEdit}
        isOpen={isSystemModalOpen}
        onClose={handleOnCloseModal}
      />
      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader title="Sistemas de ensayo">
        {!isLoading && !emptyData && (
          <TestSystemsToolbar
            onAddTestSystem={handleOnOpenModal}
            onSearch={onSearch}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
          />
        )}
      </PageHeader>
      {isLoading ? <LoadingTableSpinner /> : null}
      {emptyData ? (
        <TestSystemsEmptyState
          onAddTestSystem={handleOnOpenModal}
          onImport={() => setShowImportModal(true)}
        />
      ) : null}
      {data && !emptyData ? (
        <TestSystemsTable
          items={searchChain !== "" ? searchedSystems : systemsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default sistemas
