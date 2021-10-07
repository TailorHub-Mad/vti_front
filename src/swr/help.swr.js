import useHelpApi from "../hooks/api/useHelpApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const helpFetchHandler = (state, options, isProjectHelp) => {
  const {
    getProjectHelps,
    getNoteHelps,
    getSearchProjectHelps,
    getSearchNotesHelps
  } = useHelpApi()

  const fetchHandler = {
    all: () =>
      useFetchSWR(
        isProjectHelp ? SWR_CACHE_KEYS.projectHelps : SWR_CACHE_KEYS.noteHelps,
        isProjectHelp ? getProjectHelps : getNoteHelps
      ),
    search: () =>
      useFetchSWR(
        [
          isProjectHelp
            ? SWR_CACHE_KEYS.searchProjectHelps
            : SWR_CACHE_KEYS.searchNoteHelps,
          options[fetchOption.SEARCH]
        ],
        isProjectHelp ? getSearchProjectHelps : getSearchNotesHelps
      )
  }

  return fetchHandler[state]()
}
