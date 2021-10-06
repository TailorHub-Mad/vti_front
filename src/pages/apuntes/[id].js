import { useRouter } from "next/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { projectFetchHandler } from "../../swr/project.swr"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { errorHandler } from "../../utils/errors"
import { LoadingView } from "../../views/common/LoadingView"

const apunte = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchType.ID,
    {
      [fetchOption.ID]: router.query.id
    }
  )

  const notFound = !isValidating && !data

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !data ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el apunte.</>}
      {data && (
        <>
          <PageHeader></PageHeader>
        </>
      )}
    </Page>
  )
}

export default apunte
