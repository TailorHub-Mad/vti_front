import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { PATHS } from "../../utils/constants/global"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"
import { checkDataIsEmpty } from "../../utils/functions/global"
import { projectFetchHandler } from "../../swr/project.swr"

const client = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const clientId = router.query.id

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `projects.clientId=${clientId}`
  })

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data && !isEmptyData ? data[0].projects : null

  const client = projectsData && projectsData[0]?.clientAlias

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el cliente.</>}
      <ProjectsByObject
        projects={projectsData}
        customURL={`${PATHS.clients}/${client || clientId}`}
        setFetchState={setFetchState}
        setFetchOptions={setFetchOptions}
        fetchState={fetchState}
        fetchOptions={fetchOptions}
        isEmptyData={isEmptyData}
        hrefBack={PATHS.clients}
        backText={"Volver a clientes"}
      />
    </Page>
  )
}

export default client
