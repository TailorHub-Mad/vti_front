import useSystemApi from "../hooks/api/useSystemApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const systemFetchHandler = (state, options) => {
  const {
    getSystems,
    getSystem,
    getFilterSystems,
    getGroupSystems,
    getSearchSystems
  } = useSystemApi()

  console.log(state, options)

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.systems, getSystems),
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.client, options[fetchOption.ID]], getSystem),
    group: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.groupSystems, options[fetchOption.GROUP]],
        getGroupSystems
      ),
    filter: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.filterSystems, options[fetchOption.FILTER]],
        getFilterSystems
      ),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchSystems, options[fetchOption.SEARCH]],
        getSearchSystems
      )
  }

  return fetchHandler[state]()
}
