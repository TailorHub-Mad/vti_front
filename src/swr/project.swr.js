import useProjectApi from "../hooks/api/useProjectApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const projectFetchHandler = (state, options) => {
  const {
    getProjects,
    getProject,
    getGroupedProjects,
    getFilteredProjects,
    getSearchProjects
  } = useProjectApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.projects, getProjects),
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.project, options[fetchOption.ID]], getProject),
    group: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.groupedProjects, options[fetchOption.GROUP]],
        getGroupedProjects
      ),
    filter: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.filterProjects, options[fetchOption.FILTER]],
        getFilteredProjects
      ),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchProjects, options[fetchOption.SEARCH]],
        getSearchProjects
      )
  }

  return fetchHandler[state]()
}
