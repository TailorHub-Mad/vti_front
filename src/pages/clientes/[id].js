import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useClientApi from "../../hooks/api/useClientApi"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { ProjectsToolBar } from "../../views/projects/ProjectsToolBar/ProjectsToolBar"

const client = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [client, setClient] = useState(null)
  const { getClient } = useClientApi()
  const router = useRouter()
  useEffect(() => {
    setIsFetching(true)
    const fetchClient = async () => {
      const _clients = await getClient(router.query.id)
      setClient(_clients)
      setIsFetching(false)
    }
    fetchClient()
  }, [])
  return (
    <Page>
      {isFetching ? <LoadingTableSpinner /> : null}

      {client && !isFetching ? (
        <>
          <PageHeader>
            <BreadCrumbs lastText="Proyectos" />
            <ProjectsToolBar />
          </PageHeader>
          <ProjectsTable items={client.projects} />
        </>
      ) : null}
    </Page>
  )
}

export default client
