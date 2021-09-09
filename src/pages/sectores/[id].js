import { useRouter } from "next/dist/client/router"
import { useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useSectorApi from "../../hooks/api/useSectorApi"
import { MOCK_BACK_PROJECTS_DATA } from "../../mock/projects_table"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"

const sector = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [sector, setSector] = useState(null)
  const { getSector } = useSectorApi()
  const router = useRouter()
  useEffect(() => {
    setIsFetching(true)
    const fetchSector = async () => {
      const sector = await getSector(router.query.id)
      setSector(sector)
      setIsFetching(false)
    }
    fetchSector()
  }, [])
  return (
    <Page>
      {isFetching ? <LoadingTableSpinner /> : null}

      {sector && !isFetching ? (
        <>
          <PageHeader>
            <BreadCrumbs lastText="Proyectos" />
            <ToolBar />
          </PageHeader>
          <ProjectsTable items={MOCK_BACK_PROJECTS_DATA} />
        </>
      ) : null}
    </Page>
  )
}

export default sector
