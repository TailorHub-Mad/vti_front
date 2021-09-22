import { useRouter } from "next/dist/client/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { sectorFetchHandler } from "../../swr/sector.swr"
import { fetchOption, fetchType } from "../../utils/constants/global_config"
import { PATHS } from "../../utils/constants/paths"
import { errorHandler } from "../../utils/errors"
import { LoadingView } from "../../views/common/LoadingView"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"

const sector = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const { data, error, isLoading, isValidating } = sectorFetchHandler(fetchType.ID, {
    [fetchOption.ID]: router.query.id
  })

  const notFound = !isValidating && !data

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el sector.</>}
      {data && (
        <ProjectsByObject
          projects={data.projects}
          customURL={`${PATHS.clients}/${data.ref}`}
        />
      )}
    </Page>
  )
}

export default sector
