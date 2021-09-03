import { useEffect, useState } from "react"
import { Page } from "../components/layout/Page/Page"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useClientsApi from "../hooks/api/useClientsApi"
import { ClientsTable } from "../views/clients/ClientsTable/ClientsTable"
import { ClientsToolBar } from "../views/clients/ClientsToolBar/ClientsToolBar"
import { NotesEmptyState } from "../views/notes/NotesEmptyState/NotesEmptyState"

const clientes = () => {
  const isFetching = false
  const projects = new Array(50).fill("")
  const areProjects = projects && projects.length > 0
  //TODO Fetch de la lista de proyectos, gestion de la carga y pasarlo a la tabla por props
  const { getClients } = useClientsApi()
  const [clients, setClients] = useState(null)

  useEffect(() => {
    const fetchClients = async () => {
      const _clients = await getClients()
      setClients(_clients)
    }
    fetchClients()
  }, [])

  console.log(clients)

  return (
    <Page>
      <PageHeader title="Clientes">
        {areProjects && !isFetching ? <ClientsToolBar /> : null}
      </PageHeader>
      {isFetching ? <LoadingTableSpinner /> : null}
      {!areProjects ? <NotesEmptyState /> : null}
      {areProjects && !isFetching ? (
        <ClientsTable clients={clients} />
      ) : null}
    </Page>
  )
}

export default clientes
