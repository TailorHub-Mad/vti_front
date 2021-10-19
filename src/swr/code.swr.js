import useCodeApi from "../hooks/api/useCodeApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const codeFetchHandler = (state, options) => {
  const { getCodes, getCode, getSearchCodes } = useCodeApi()

  const fetchHandler = {
    all: () => {
      if (options)
        return useFetchSWR(
          [SWR_CACHE_KEYS.codes, options[fetchOption.ORDER]],
          getCodes
        )
      else return useFetchSWR(SWR_CACHE_KEYS.codes, getCodes)
    },
    id: () => useFetchSWR([SWR_CACHE_KEYS.code, options[fetchOption.ID]], getCode),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchCodes, options[fetchOption.SEARCH]],
        getSearchCodes
      )
  }

  return fetchHandler[state]()
}
