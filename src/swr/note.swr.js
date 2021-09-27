import useNoteApi from "../hooks/api/useNoteApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption, SWR_CACHE_KEYS } from "../utils/constants/swr"

export const noteFetchHandler = (state, options) => {
  const { getNotes, getgroupNotes, getfilterNotes, getSearchNotes } = useNoteApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.notes, getNotes),
    group: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.groupNotes, options[fetchOption.GROUP]],
        getgroupNotes
      ),
    filter: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.filterNotes, options[fetchOption.FILTER]],
        getfilterNotes
      ),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchNotes, options[fetchOption.SEARCH]],
        getSearchNotes
      )
  }

  return fetchHandler[state]()
}
