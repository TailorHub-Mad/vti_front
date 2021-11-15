import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { PATHS } from "../../utils/constants/global"
import { checkDataIsEmpty } from "../../utils/functions/global"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"
import { projectFetchHandler } from "../../swr/project.swr"
import { useMediaQuery } from "@chakra-ui/media-query"

const system = () => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const systemId = router.query.id

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `projects.testSystems._id=${systemId}`
  })

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data && !isEmptyData ? data[0].projects : null

  const system =
    projectsData && projectsData[0].testSystems?.find((t) => t._id === systemId)

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {notFound && <>Error. No se ha encontrado el sistema.</>}
      {isLoading || !data ? (
        <LoadingView mt="-200px" />
      ) : (
        <ProjectsByObject
          projects={projectsData}
          customURL={
            isScreen
              ? `${PATHS.testSystems}/${system?.alias || systemId}`
              : `${PATHS.testSystems}`
          }
          setFetchState={setFetchState}
          setFetchOptions={setFetchOptions}
          fetchState={fetchState}
          fetchOptions={fetchOptions}
          isEmptyData={isEmptyData}
          hrefBack={PATHS.testSystems}
          backText={"Volver a sistemas"}
        />
      )}
    </Page>
  )
}

export default system
