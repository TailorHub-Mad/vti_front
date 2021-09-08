import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useClientsApi from "../../hooks/api/useClientsApi"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { ProjectsToolBar } from "../../views/projects/ProjectsToolBar/ProjectsToolBar"

const client = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [client, setClient] = useState(null)
  const { getClient } = useClientsApi()
  const router = useRouter()
  useEffect(() => {
    setIsFetching(true)
    const fetchClients = async () => {
      const _clients = await getClient(router.query.id)
      setClient(_clients)
      setIsFetching(false)
    }
    fetchClients()
  }, [])
  return (
    <Page>
      {isFetching ? <LoadingTableSpinner /> : null}

      {client && !isFetching ? (
        <>
          <PageHeader title={`Clientes / ${client?.alias} / Proyectos`}>
            <ProjectsToolBar />
          </PageHeader>
          <ProjectsTable items={client.projects} />
        </>
      ) : null}
    </Page>
  )
}

export default client
