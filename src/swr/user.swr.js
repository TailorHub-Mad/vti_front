import useUserApi from "../hooks/api/useUserApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption } from "../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const userFetchHandler = (state, options) => {
  const { getUsers, getUser } = useUserApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.users, getUsers),
    id: () => useFetchSWR([SWR_CACHE_KEYS.user, options[fetchOption.ID]], getUser)
  }

  return fetchHandler[state]()
}
