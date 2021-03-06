import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { PATHS } from "../../utils/constants/global"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"
import { projectFetchHandler } from "../../swr/project.swr"
import { checkDataIsEmpty } from "../../utils/functions/global"

const user = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  // const userId = router.query.id
  const userAlias = router.query.id

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `projects.users.alias=${userAlias}`
  })

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data && !isEmptyData ? data[0].projects : null

  // const user = projectsData && projectsData[0].users?.find((t) => t._id === userId)
  const user =
    projectsData && projectsData[0].users?.find((t) => t.alias === userAlias)

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {notFound && <>Error. No se ha encontrado el cliente.</>}
      {isLoading || !data ? (
        <LoadingView mt="-200px" />
      ) : (
        <ProjectsByObject
          projects={projectsData}
          // customURL={`${PATHS.users}/${user?.ref || userId}`}
          customURL={`${PATHS.users}/${user?.ref || userAlias}`}
          setFetchState={setFetchState}
          setFetchOptions={setFetchOptions}
          fetchState={fetchState}
          fetchOptions={fetchOptions}
          isEmptyData={isEmptyData}
          hrefBack={PATHS.users}
          backText={"Volver a usuarios"}
        />
      )}
    </Page>
  )
}

export default user
