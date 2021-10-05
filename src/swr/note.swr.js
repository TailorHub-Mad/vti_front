import useNoteApi from "../hooks/api/useNoteApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption, SWR_CACHE_KEYS } from "../utils/constants/swr"

export const noteFetchHandler = (state, options) => {
  const {
    getNotes,
    getNote,
    getGroupNotes,
    getFilterNotes,
    getSearchNotes,
    getFavsNotes,
    getSubscribeNotes,
    getUnreadNotes,
    getActiveNotes
  } = useNoteApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.notes, getNotes),
    id: () => useFetchSWR([SWR_CACHE_KEYS.note, options[fetchOption.ID]], getNote),

    group: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.groupNotes, options[fetchOption.GROUP]],
        getGroupNotes
      ),
    filter: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.filterNotes, options[fetchOption.FILTER]],
        getFilterNotes
      ),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchNotes, options[fetchOption.SEARCH]],
        getSearchNotes
      ),

    favs: () => useFetchSWR(SWR_CACHE_KEYS.favsNotes, getFavsNotes),
    suscribed: () => useFetchSWR(SWR_CACHE_KEYS.subscribeNotes, getSubscribeNotes),
    unread: () => useFetchSWR(SWR_CACHE_KEYS.unreadNotes, getUnreadNotes),
    active: () => useFetchSWR(SWR_CACHE_KEYS.activeNotes, getActiveNotes)
  }

  return fetchHandler[state]()
}
