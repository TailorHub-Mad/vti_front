import { useRouter } from "next/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { departmentFetchHandler } from "../../swr/department.swr"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { PATHS } from "../../utils/constants/global"
import { errorHandler } from "../../utils/errors"
import { LoadingView } from "../../views/common/LoadingView"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"

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
        <ProjectsByObject
          projects={data.projects}
          customURL={`${PATHS.departments}/${data.ref}`}
        />
      )}
    </Page>
  )
}

export default department
