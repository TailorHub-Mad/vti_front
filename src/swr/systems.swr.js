import useSystemApi from "../hooks/api/useSystemApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const systemFetchHandler = (state, options) => {
  const { getSystems, getSystem } = useSystemApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.systems, getSystems),
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.client, options[fetchOption.ID]], getSystem)
  }

  return fetchHandler[state]()
}
