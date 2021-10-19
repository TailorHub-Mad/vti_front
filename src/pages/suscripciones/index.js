import { useContext, useState } from "react"
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

const suscripciones = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)

  // States
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  // Fetch
  const { data, error, isLoading } = subscriptionFetchHandler(
    fetchState,
    fetchOptions
  )

  const isEmptyData = checkDataIsEmpty(data)
  const subscriptionsData = data && !isEmptyData ? data : null

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

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
      [fetchOption.SEARCH]: search
    })
  }

  const handleSortElement = (data) => {
    const { name, order } = data

    if (!name || !order) return

    setFetchOptions({
      [fetchOption.ORDER]: `&testSystems_${name}=${order}`
    })
  }

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden ? (
          <ToolBar
            onSearch={onSearch}
            searchPlaceholder="Busqueda por ID, Alias"
            noFilter
            noGroup
            noAdd
            noImport
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {isEmptyData ? (
        <ViewNotFoundState />
      ) : (
        <SubscriptionsTable
          subscriptions={subscriptionsData}
          handleSortElement={handleSortElement}
        />
      )}
    </Page>
  )
}

export default suscripciones
