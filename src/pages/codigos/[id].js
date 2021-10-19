import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { PATHS } from "../../utils/constants/global"
import { errorHandler } from "../../utils/errors"
import { LoadingView } from "../../views/common/LoadingView"
import { ProjectsByObject } from "../../views/projects/ProjectsByObject/ProjectsByObject"
import { checkDataIsEmpty } from "../../utils/functions/global"
import { projectFetchHandler } from "../../swr/project.swr"

const codigo = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const codeId = router.query.id

  const [fetchState, setFetchState] = useState(fetchType.FILTER)
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: `projects.code._id=${codeId}`
  })

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const notFound = !isValidating && !data
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data && !isEmptyData ? data[0].projects : null

  const code = projectsData && projectsData[0].code?.find((t) => t._id === codeId)

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el código.</>}
      <ProjectsByObject
        projects={projectsData}
        customURL={`${PATHS.codes}/${code?.ref || codeId}`}
        setFetchState={setFetchState}
        setFetchOptions={setFetchOptions}
        fetchState={fetchState}
        fetchOptions={fetchOptions}
        isEmptyData={isEmptyData}
        hrefBack={PATHS.codes}
        backText={"Volver a códigos"}
      />
    </Page>
  )
}

export default codigo
