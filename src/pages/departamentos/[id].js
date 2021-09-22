import { useRouter } from "next/dist/client/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { departmentFetchHandler } from "../../swr/department.swr"
import { fetchOption, fetchType } from "../../utils/constants/global_config"
import { errorHandler } from "../../utils/errors"
import { LoadingView } from "../../views/common/LoadingView"
import { ProjectsTable } from "../../views/projects/ProjectTable/ProjectTable"

const department = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const { data, error, isLoading, isValidating } = departmentFetchHandler(
    fetchType.ID,
    {
      [fetchOption.ID]: router.query.id
    }
  )

  const notFound = !isValidating && !data

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
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
