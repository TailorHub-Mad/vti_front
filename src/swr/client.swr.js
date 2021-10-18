import useClientApi from "../hooks/api/useClientApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const clientFetchHandler = (state, options) => {
  const { getClients, getClient, getSearchClients } = useClientApi()

  const fetchHandler = {
    all: () => {
      if (options)
        return useFetchSWR(
          [SWR_CACHE_KEYS.clients, options[fetchOption.ORDER]],
          getClients
        )
      else return useFetchSWR(SWR_CACHE_KEYS.clients, getClients)
    },
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.client, options[fetchOption.ID]], getClient),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchClients, options[fetchOption.SEARCH]],
        getSearchClients
      )
  }

  return fetchHandler[state]()
}
