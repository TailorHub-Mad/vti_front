import { isEmpty } from "lodash"
import useProjectApi from "../hooks/api/useProjectApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const projectFetchHandler = (state, options) => {
  const {
    getProjects,
    getProject,
    getGroupProjects,
    getActiveProjects,
    getFilterProjects,
    getSearchProjects,
    getFavsProjects,
    getSubscribeProjects
  } = useProjectApi()

  const fetchHandler = {
    all: () => {
      if (!isEmpty(options))
        return useFetchSWR(
          [SWR_CACHE_KEYS.projects, options[fetchOption.ORDER]],
          getProjects
        )
      else return useFetchSWR(SWR_CACHE_KEYS.projects, getProjects)
    },
    id: () =>
      useFetchSWR([SWR_CACHE_KEYS.project, options[fetchOption.ID]], getProject),
    active: () => useFetchSWR(SWR_CACHE_KEYS.activeProjects, getActiveProjects),
    group: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.groupProjects, options[fetchOption.GROUP]],
        getGroupProjects
      ),
    filter: () => {
      const order = options[fetchOption.ORDER]
      let query = options[fetchOption.FILTER]

      if (order) query = `${query}&${order}`

      return useFetchSWR([SWR_CACHE_KEYS.filterProjects, query], getFilterProjects)
    },

    favs: () => useFetchSWR(SWR_CACHE_KEYS.favsProjects, getFavsProjects),
    subscribed: () =>
      useFetchSWR(SWR_CACHE_KEYS.subscribeProjects, getSubscribeProjects),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchProjects, options[fetchOption.SEARCH]],
        getSearchProjects
      )
  }

  return fetchHandler[state]()
}
