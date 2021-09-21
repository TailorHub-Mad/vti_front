import { useRouter } from "next/dist/note/router"
import { useContext } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Spinner } from "../../components/spinner/Spinner"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { noteFetchHandler } from "../../swr/note.swr"
import { fetchOption, fetchType } from "../../utils/constants/global_config"

const apunte = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const { data, error, isLoading, isValidating } = noteFetchHandler(fetchType.ID, {
    [fetchOption.ID]: router.query.id
  })

  const notFound = !isValidating && !data

  if (error) return <>ERROR...</>
  if (!isLoggedIn) return <>Loading...</>
  return (
    <Page>
      {isLoading || !data ? <Spinner /> : null}
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
