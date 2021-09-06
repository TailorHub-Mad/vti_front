import { useContext, useState } from "react"
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

const DELETE_TYPE = {
  ONE: "deleteOne",
  MANY: "deleteMany",
}

const sistemas = () => {
  const { isLoggedIn } = useContext(ApiUserContext)
  const { systems, deleteSystem } = useSystemApi()
  const { showToast } = useContext(ApiToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR("systems/", systems)

  const [deleteType, setDeleteType] = useState(null)
  const [systemsToDelete, setSystemsToDelete] = useState(null)

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

      <PageHeader title="Sistemas de ensayo">
        {!isLoading && !emptyData && <TestSystemsToolbar />}
      </PageHeader>
      {isLoading ? <LoadingTableSpinner /> : null}
      {emptyData ? <TestSystemsEmptyState /> : null}
      {data && !emptyData ? (
        <TestSystemsTable
          items={systemsData}
          onDelete={(id) => handleOpenPopup(id, DELETE_TYPE.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DELETE_TYPE.MANY)}
          onEdit={onEdit}
        />
      ) : null}
    </Page>
  )
}

export default sistemas
