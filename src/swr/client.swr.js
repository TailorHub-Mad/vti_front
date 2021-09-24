import useClientApi from "../hooks/api/useClientApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/global"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const clientFetchHandler = (state, options) => {
  const { getClients, getClient } = useClientApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.clients, getClients),
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.client, options[fetchOption.ID]], getClient)
  }

  return fetchHandler[state]()
}
