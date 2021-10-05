import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Page } from "../../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { LoadingView } from "../../../views/common/LoadingView"
import { errorHandler } from "../../../utils/errors"
import { ProjectsByObject } from "../../../views/projects/ProjectsByObject/ProjectsByObject"
import { projectFetchHandler } from "../../../swr/project.swr"
import { checkDataIsEmpty } from "../../../utils/functions/global"

const tag = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const tagId = router.query.id

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `projects.tags._id=${tagId}`
  })

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data && !isEmptyData ? data[0].projects : null

  const tag = projectsData && projectsData[0].tags?.find((t) => t._id === tagId)

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {notFound ? <>Error. No se ha encontrado el tag.</> : null}
      {isEmptyData ? <>No hay projectos asociados.</> : null}
      {projectsData ? (
        <ProjectsByObject
          projects={projectsData}
          customURL={`Tags/${tag?.name}`}
          setFetchState={setFetchState}
          setFetchOptions={setFetchOptions}
          fetchState={fetchState}
          fetchOptions={fetchOptions}
        />
      ) : null}
    </Page>
  )
}

export default tag