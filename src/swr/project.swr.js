import useProjectApi from "../hooks/api/useProjectApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const projectFetchHandler = (state) => {
  const { getProjects, getGroupedProjects } = useProjectApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.projects, getProjects),
    grouped: () => useFetchSWR(SWR_CACHE_KEYS.groupedProjects, getGroupedProjects)
  }

  return fetchHandler[state]()
}
