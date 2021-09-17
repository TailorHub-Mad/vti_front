import useDepartmentApi from "../hooks/api/useDepartmentApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/global_config"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const departmentFetchHandler = (state, options) => {
  const { getDepartments, getDepartment } = useDepartmentApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.departments, getDepartments),
    id: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.department, options[fetchOption.ID]],
        getDepartment
      ),
  }

  return fetchHandler[state]()
}
