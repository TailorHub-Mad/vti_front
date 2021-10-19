import useDepartmentApi from "../hooks/api/useDepartmentApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"
import { isEmpty } from "lodash"

export const departmentFetchHandler = (state, options) => {
  const { getDepartments, getDepartment, getSearchDepartments } = useDepartmentApi()

  const fetchHandler = {
    all: () => {
      if (!isEmpty(options))
        return useFetchSWR(
          [SWR_CACHE_KEYS.departments, options[fetchOption.ORDER]],
          getDepartments
        )
      else return useFetchSWR(SWR_CACHE_KEYS.departments, getDepartments)
    },
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
