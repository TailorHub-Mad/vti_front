import useDepartmentApi from "../hooks/api/useDepartmentApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const departmentFetchHandler = (state, options) => {
  const { getDepartments, getDepartment, getSearchDepartments } = useDepartmentApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.departments, getDepartments),
    id: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.department, options[fetchOption.ID]],
        getDepartment
      ),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchDepartments, options[fetchOption.SEARCH]],
        getSearchDepartments
      )
  }

  return fetchHandler[state]()
}
