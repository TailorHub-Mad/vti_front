import { useRouter } from "next/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/global_config"
import { systemFetchHandler } from "../../swr/systems.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { PATHS } from "../../utils/constants/paths"
import { checkDataIsEmpty } from "../../utils/functions/common"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"

const system = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const { data, error, isLoading, isValidating } = systemFetchHandler(fetchType.ID, {
    [fetchOption.ID]: router.query.id
  })

  const notFound = !isValidating && !data
  const systemData = data && !checkDataIsEmpty(data) ? data[0].testSystems[0] : null

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el sistema.</>}
      {systemData && (
        <ProjectsByObject
          projects={systemData.projects}
          customURL={`${PATHS.testSystems}/${systemData.ref}`}
        />
      )}
    </Page>
  )
}

export default system
