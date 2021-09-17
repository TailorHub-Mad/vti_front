import useNoteApi from "../hooks/api/useNoteApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../utils/constants/swr"

export const noteFetchHandler = (state /*options*/) => {
  const { notes } = useNoteApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.projects, notes),
  }

  return fetchHandler[state]()
}
