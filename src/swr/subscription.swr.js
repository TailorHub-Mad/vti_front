import useSubscriptionApi from "../hooks/api/useSubscriptionApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"
import { isEmpty } from "lodash"

export const subscriptionFetchHandler = (state, options) => {
  const { getSubscriptions, getSubscription, getSearchSubscriptions } =
    useSubscriptionApi()

  const fetchHandler = {
    all: () => {
      if (!isEmpty(options))
        return useFetchSWR(
          [SWR_CACHE_KEYS.subscriptions, options[fetchOption.ORDER]],
          getSubscriptions
        )
      else return useFetchSWR(SWR_CACHE_KEYS.subscriptions, getSubscriptions)
    },
    id: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.subscription, options[fetchOption.ID]],
        getSubscription
      ),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchSubscriptions, options[fetchOption.SEARCH]],
        getSearchSubscriptions
      )
  }

  return fetchHandler[state]()
}
