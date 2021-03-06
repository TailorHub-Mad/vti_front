import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { Page } from "../../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { LoadingView } from "../../../views/common/LoadingView"
import { errorHandler } from "../../../utils/errors"
import { ProjectsByObject } from "../../../views/projects/ProjectsByObject/ProjectsByObject"
import { projectFetchHandler } from "../../../swr/project.swr"
import { checkDataIsEmpty } from "../../../utils/functions/global"
import { PATHS } from "../../../utils/constants/global"
import { useMediaQuery } from "@chakra-ui/media-query"

const tag = () => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const tagId = router.query.id
  const filterQuery = `projects.tags._id=${tagId}`

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: filterQuery
  })

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data && !isEmptyData ? data[0].projects : null

  const tag = projectsData && projectsData[0].tags?.find((t) => t._id === tagId)

  useEffect(() => {
    if (fetchOptions) return null
    setFetchOptions(filterQuery)
  }, [fetchOptions])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {notFound ? <>Error. No se ha encontrado el tag.</> : null}
      {isLoading ? (
        <LoadingView mt="-200px" />
      ) : (
        <ProjectsByObject
          projects={projectsData}
          customURL={isScreen ? `Tags/${tag?.name}` : "Tags"}
          setFetchState={setFetchState}
          setFetchOptions={setFetchOptions}
          fetchState={fetchState}
          fetchOptions={fetchOptions}
          isEmptyData={isEmptyData}
          hrefBack={PATHS.projectTags}
          backText={"Volver a tags"}
          isValidating={isValidating}
          filterQuery={filterQuery}
        />
      )}
    </Page>
  )
}

export default tag
