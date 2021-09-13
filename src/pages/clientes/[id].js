import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { Spinner } from "../../components/spinner/Spinner"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { useSWRConfig } from "swr"
import useClientApi from "../../hooks/api/useClientApi"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"

const client = () => {
  const router = useRouter()
  const { cache } = useSWRConfig()
  const { getClient: client } = useClientApi()

  const [clientData, setClientData] = useState(null)
  const [clientNotFound, setClientNotFound] = useState(false)

  const findClientInCache = (clients, id) => {
    const client = clients.find((client) => client.id === id)
    if (client) return setClientData(client)
    getClient()
  }

  const getClient = async () => {
    const data = await client(router.query.id)
    data.length === 0 ? setClientNotFound(true) : setClientData(data[0])
  }

  useEffect(() => {
    if (!cache.has(SWR_CACHE_KEYS.clients)) return getClient()
    findClientInCache(cache.get(SWR_CACHE_KEYS.clients), router.query.id)
  }, [cache])

  // TOOD -> Manage error page
  if (clientNotFound) return <>Error. No se ha encontrado el Client.</>
  return (
    <Page>
      {clientData ? (
        <>
          <PageHeader>
            <BreadCrumbs lastText="Proyectos" />
            <ToolBar />
          </PageHeader>
          <ProjectsTable items={clientData.projects} />
        </>
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default client
