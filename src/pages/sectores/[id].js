import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Spinner } from "../../components/spinner/Spinner"
import useSectorApi from "../../hooks/api/useSectorApi"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"

const sector = () => {
  const router = useRouter()
  const { cache } = useSWRConfig()
  const { getSector: sector } = useSectorApi()

  const [sectorData, setSectorData] = useState(null)
  const [sectorNotFound, setSectorNotFound] = useState(false)

  const findSectorInCache = (sectors, id) => {
    const sector = sectors.find((sector) => sector.id === id)
    if (sector) return setSectorData(sector)
    getSector()
  }

  const getSector = async () => {
    const data = await sector(router.query.id)
    data.length === 0 ? setSectorNotFound(true) : setSectorData(data[0])
  }

  useEffect(() => {
    if (!cache.has(SWR_CACHE_KEYS.sectors)) return getSector()
    findSectorInCache(cache.get(SWR_CACHE_KEYS.sectors), router.query.id)
  }, [cache])

  console.log(sectorData)

  // TOOD -> Manage error page
  if (sectorNotFound) return <>Error. No se ha encontrado el Sector.</>
  return (
    <Page>
      {sectorData ? (
        <>
          <PageHeader>
            <BreadCrumbs lastText="Proyectos" />
            <ToolBar />
          </PageHeader>
          <ProjectsTable items={sectorData.projects} />
        </>
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default sector
