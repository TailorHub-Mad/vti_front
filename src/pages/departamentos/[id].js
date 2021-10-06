import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { departmentFetchHandler } from "../../swr/department.swr"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { PATHS } from "../../utils/constants/global"
import { errorHandler } from "../../utils/errors"
import { LoadingView } from "../../views/common/LoadingView"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"
import { checkDataIsEmpty } from "../../utils/functions/global"

const department = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const departmentId = router.query.id

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `projects.departments._id=${departmentId}`
  })

  const { data, error, isLoading, isValidating } = departmentFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data && !isEmptyData ? data[0].projects : null

  const department =
    projectsData && projectsData[0].tags?.find((t) => t._id === departmentId)

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el departamento.</>}
      {data && (
        <ProjectsByObject
          projects={data.projects}
          customURL={`${PATHS.departments}/${department?.ref}`}
          setFetchState={setFetchState}
          setFetchOptions={setFetchOptions}
          fetchState={fetchState}
          fetchOptions={fetchOptions}
        />
      )}
    </Page>
  )
}

export default department
