import useTagApi from "../hooks/api/useTagApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption, SWR_CACHE_KEYS } from "../utils/constants/swr"

export const tagFetchHandler = (state, options, isProjectTag) => {
  const { getProjectTags, getNoteTags, getSearchProjectTags, getSearchNotesTags } =
    useTagApi()

  const fetchHandler = {
    all: () =>
      useFetchSWR(
        isProjectTag ? SWR_CACHE_KEYS.projectTags : SWR_CACHE_KEYS.noteTags,
        isProjectTag ? getProjectTags : getNoteTags
      ),
    search: () =>
      useFetchSWR(
        [
          isProjectTag
            ? SWR_CACHE_KEYS.searchProjectTags
            : SWR_CACHE_KEYS.searchNoteTags,
          options[fetchOption.SEARCH]
        ],
        isProjectTag ? getSearchProjectTags : getSearchNotesTags
      )
  }

  return fetchHandler[state]()
}
