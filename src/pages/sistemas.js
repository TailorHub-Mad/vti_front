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

const DELETE_TYPE = {
  ONE: "deleteOne",
  MANY: "deleteMany",
}

const sistemas = () => {
  const { isLoggedIn } = useContext(ApiUserContext)
  const { systems, deleteSystem } = useSystemApi()
  const { showToast } = useContext(ApiToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR("systems/", systems)

  // Create - Update state
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false)
  const [systemToEdit, setSystemToEdit] = useState(false)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [systemsToDelete, setSystemsToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [searchedSystems, setSearchedSystems] = useState([])

  const emptyData = Boolean(data && data[0].testSystem.length === 0)
  const systemsData = data ? data[0].testSystem : []

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
    setIsSystemModalOpen(false)
    setSystemToEdit(null)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DELETE_TYPE.ONE ? deleteOne : deleteMany
    await f(systemsToDelete, systemsData)
    setDeleteType(null)
    setSystemsToDelete(null)
  }

  const deleteOne = async (id, systems) => {
    await deleteSystem(id)
    const updatedSystems = []
    updatedSystems.push({
      testSystem: systems.filter((system) => system._id !== id),
    })
    await mutate(updatedSystems, false)
    showToast("Sistema de ensayo borrado correctamente")
  }

  const deleteMany = async (positions, systems) => {
    const deleteSystems = positions.map(async (position) =>
      deleteSystem(systemsData[position]._id)
    )
    await Promise.all(deleteSystems)
    pullAt(systems, positions)
    const updatedSystems = []
    updatedSystems.push({ testSystem: systems })
    await mutate(updatedSystems, false)
    showToast("Sistemas de ensayo borrados correctamente")
  }

  const onEdit = (/* id */) => {
    // const [client] = [...clients].filter((client) => client._id === id)
    // setClientToEdit(client)
    // setIsClientModalOpen(true)
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
        {deleteType === DELETE_TYPE.ONE
          ? `¿Desea eliminar ${systemsToDelete}?`
          : "¿Desea eliminar los sistemas de ensayo seleccionados?"}
      </Popup>

      <NewTestSystemModal
        clientToEdit={systemToEdit}
        isOpen={isSystemModalOpen}
        onClose={handleOnCloseModal}
      />

      <PageHeader title="Sistemas de ensayo">
        {!isLoading && !emptyData && (
          <TestSystemsToolbar
            onAddTestSystem={handleOnOpenModal}
            onSearch={onSearch}
          />
        )}
      </PageHeader>
      {isLoading ? <LoadingTableSpinner /> : null}
      {emptyData ? (
        <TestSystemsEmptyState onAddTestSystem={handleOnOpenModal} />
      ) : null}
      {data && !emptyData ? (
        <TestSystemsTable
          items={searchChain !== "" ? searchedSystems : systemsData}
          onDelete={(id) => handleOpenPopup(id, DELETE_TYPE.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DELETE_TYPE.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default sistemas
