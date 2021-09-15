import { useRouter } from "next/dist/client/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { Spinner } from "../../components/spinner/Spinner"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import useSystemApi from "../../hooks/api/useSystemApi"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import useFetchSWR from "../../hooks/useFetchSWR"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"

const system = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getDepartment } = useSystemApi()

  const { data, error, isLoading, isValidating } = useFetchSWR(
    [SWR_CACHE_KEYS.department, router.query.id],
    getDepartment
  )

  const notFound = !isValidating && !data

  if (error) return <>ERROR...</>
  if (!isLoggedIn) return <>Loading...</>
  return (
    <Page>
      {isLoading || !data ? <Spinner /> : null}
      {notFound && <>Error. No se ha encontrado el sistema.</>}
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

export default system
