import { useRouter } from "next/dist/client/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Spinner } from "../../components/spinner/Spinner"
import useDepartmentApi from "../../hooks/api/useDepartmentApi"
import useFetchSWR from "../../hooks/useFetchSWR"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"

const department = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getDepartment } = useDepartmentApi()

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
      {notFound && <>Error. No se ha encontrado el departamento.</>}
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

export default department
