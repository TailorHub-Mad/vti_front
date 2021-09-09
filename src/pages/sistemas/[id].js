import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { ProjectsToolBar } from "../../views/projects/ProjectsToolBar/ProjectsToolBar"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { useSWRConfig } from "swr"
import useSystemApi from "../../hooks/api/useSystemsApi"

const system = () => {
  const router = useRouter()
  const { cache } = useSWRConfig()
  const { system } = useSystemApi()

  const [systemData, setSystemData] = useState(null)
  const [systemNotFound, setSystemNotFound] = useState(false)

  const findSystemInCache = (systems, id) => {
    const system = systems.find((system) => system._id === id)
    if (system) return setSystemData(system)
    getSystem()
  }

  const getSystem = async () => {
    const data = await system(router.query.id)
    data.length === 0
      ? setSystemNotFound(true)
      : setSystemData(data[0].testSystems[0])
  }

  useEffect(() => {
    if (!cache.has(SWR_CACHE_KEYS.systems)) return getSystem()
    findSystemInCache(
      cache.get(SWR_CACHE_KEYS.systems)[0].testSystems,
      router.query.id
    )
  }, [cache])

  // TOOD -> Manage error page
  if (systemNotFound) return <>Error. No se ha encontrado el Sistema.</>

  return (
    <Page>
      {systemData ? (
        <>
          <PageHeader>
            <BreadCrumbs lastText="Proyectos" />
            <ProjectsToolBar />
          </PageHeader>
          <ProjectsTable items={system.projects} />
        </>
      ) : (
        <LoadingTableSpinner />
      )}
    </Page>
  )
}

export default system
