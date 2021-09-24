import useSectorApi from "../hooks/api/useSectorApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const sectorFetchHandler = (state, options) => {
  const { getSectors, getSector } = useSectorApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.sectors, getSectors),
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.sector, options[fetchOption.ID]], getSector)
  }

  return fetchHandler[state]()
}
