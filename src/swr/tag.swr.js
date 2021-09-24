import useTagApi from "../hooks/api/useTagApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const tagFetchHandler = (state) => {
  const { getProjectTags, getNoteTags } = useTagApi()

  const fetchHandler = {
    notes: () => useFetchSWR(SWR_CACHE_KEYS.noteTags, getNoteTags),
    projects: () => useFetchSWR(SWR_CACHE_KEYS.projectTags, getProjectTags)
  }

  return fetchHandler[state]()
}
