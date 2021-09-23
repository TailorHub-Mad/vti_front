import { useRouter } from "next/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { clientFetchHandler } from "../../swr/client.swr"
import { fetchOption, fetchType } from "../../utils/constants/global_config"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { PATHS } from "../../utils/constants/paths"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"

const client = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const { data, error, isLoading, isValidating } = clientFetchHandler(fetchType.ID, {
    [fetchOption.ID]: router.query.id
  })

  const notFound = !isValidating && !data

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el cliente.</>}
      {data && (
        <ProjectsByObject
          projects={data.projects}
          customURL={`${PATHS.clients}/${data.ref}`}
        />
      )}
    </Page>
  )
}

export default client
