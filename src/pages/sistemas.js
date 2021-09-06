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

const sistemas = () => {
  const { isLoggedIn } = useContext(ApiUserContext)
  const { systems /*deleteSystem*/ } = useSystemApi()
  const { showToast } = useContext(ApiToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR("systems/", systems)

  const [systemToDelete, setSystemToDelete] = useState(null)

  const emptyData = !data ?? data[0].testSystem.length > 0

  const onDelete = async (id) => {
    // TODO -> API request pending
    // await deleteSystem(id)
    setSystemToDelete(null)
    const updatedSystems = [...data[0].testSystem].filter(
      (system) => system._id !== id
    )
    await mutate(updatedSystems, false)
    showToast("Sistemas de ensayo borrados correctamente")
    //TODO Diferenciar borrado multiple de individual en el popup
  }

  const onDeleteMany = async (ids, systems) => {
    // TODO -> API request pending
    // const deleteSystems = ids.map(async (id) => deleteSystem(id))
    // await Promise.all(deleteSystems)
    pullAt(systems, ids)
    const updatedSystems = []
    updatedSystems.push({ testSystem: systems })
    await mutate(updatedSystems, false)
    showToast("Sistemas de ensayo borrados correctamente")
    //TODO Diferenciar borrado multiple de individual en el popup
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
        isOpen={systemToDelete}
        onConfirm={() => onDelete(systemToDelete)}
        onClose={() => setSystemToDelete(null)}
      >
        {`Desea eliminar ${systemToDelete}`}
      </Popup>

      <PageHeader title="Sistemas de ensayo">
        {!isLoading && !emptyData && <TestSystemsToolbar />}
      </PageHeader>
      {isLoading && <LoadingTableSpinner />}
      {data && emptyData && <TestSystemsEmptyState />}
      {!isLoading && !emptyData && (
        <TestSystemsTable
          items={data[0].testSystem}
          onDelete={(id) => setSystemToDelete(id, data[0].testSystem)}
          onEdit={onEdit}
          deleteItems={(ids) => onDeleteMany(ids, data[0].testSystem)}
        />
      )}
    </Page>
  )
}

export default sistemas
