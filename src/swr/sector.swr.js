import useSectorApi from "../hooks/api/useSectorApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"
import { isEmpty } from "lodash"

export const sectorFetchHandler = (state, options) => {
  const { getSectors, getSector, getSearchSectors } = useSectorApi()

  const fetchHandler = {
    all: () => {
      if (!isEmpty(options))
        return useFetchSWR(
          [SWR_CACHE_KEYS.sectors, options[fetchOption.ORDER]],
          getSectors
        )
      else return useFetchSWR(SWR_CACHE_KEYS.sectors, getSectors)
    },
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.sector, options[fetchOption.ID]], getSector),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchSectors, options[fetchOption.SEARCH]],
        getSearchSectors
      )
  }

  return fetchHandler[state]()
}
