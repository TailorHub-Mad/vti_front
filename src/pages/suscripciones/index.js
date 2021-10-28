import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { SubscriptionsTable } from "../../views/subscriptions/SubscriptionTable/SubscriptionsTable"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { checkDataIsEmpty } from "../../utils/functions/global"
import { subscriptionFetchHandler } from "../../swr/subscription.swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import { PATHS, RoleType } from "../../utils/constants/global"
import { useRouter } from "next/router"

const suscripciones = () => {
  // Hooks
  const { isLoggedIn, role, user } = useContext(ApiAuthContext)
  const router = useRouter()

  // States
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  // Fetch
  const { data, error, isLoading, isValidating } = subscriptionFetchHandler(
    fetchState,
    fetchOptions
  )

  const isEmptyData = checkDataIsEmpty(data)
  const subscriptionsData = data && !isEmptyData ? data : null

  // Filters
  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.SEARCH]: null
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: { data: "", search }
    })
  }

  const handleSortElement = () => {}

  useEffect(() => {
    if (!user) return

    if (role === RoleType.USER) router.push(`${PATHS.subscriptions}/${user._id}`)
  }, [user])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {role === RoleType.ADMIN ? (
        <>
          <PageHeader>
            <BreadCrumbs />
            {!isEmptyData ? (
              <ToolBar
                onSearch={onSearch}
                searchPlaceholder="Busqueda por ID, Alias"
                noFilter
                noGroup
                noAdd
                noImport
                noSearch={isEmptyData ? false : true}
              />
            ) : null}
          </PageHeader>
          {isLoading ? (
            <LoadingView mt="-200px" />
          ) : isEmptyData && !isValidating ? (
            <ViewNotFoundState noBack text="No te has suscrito a nada" />
          ) : (
            <SubscriptionsTable
              subscriptions={subscriptionsData}
              handleSortElement={handleSortElement}
            />
          )}
        </>
      ) : (
        <LoadingView mt="-200px" />
      )}
    </Page>
  )
}

export default suscripciones
