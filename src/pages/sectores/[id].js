import { useRouter } from "next/dist/client/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Spinner } from "../../components/spinner/Spinner"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { sectorFetchHandler } from "../../swr/sector.swr"
import { fetchOption, fetchType } from "../../utils/constants/global_config"
import { ProjectsTable } from "../../views/projects/ProjectTable/ProjectTable"

const sector = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const { data, error, isLoading, isValidating } = sectorFetchHandler(fetchType.ID, {
    [fetchOption.ID]: router.query.id
  })

  const notFound = !isValidating && !data

  if (error) return <>ERROR...</>
  if (!isLoggedIn) return <>Loading...</>
  return (
    <Page>
      {isLoading || !data ? <Spinner /> : null}
      {notFound && <>Error. No se ha encontrado el sector.</>}
      {data && (
        <>
          <PageHeader>
            <BreadCrumbs lastText="Proyectos" />
            <ToolBar />
          </PageHeader>
          <ProjectsTable items={data.projects} />
        </>
      )}
    </Page>
  )
}

export default sector
