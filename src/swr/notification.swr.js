import useNotificationApi from "../hooks/api/useNotificationApi"
import useFetchSWR from "../hooks/useFetchSWR"
import { fetchOption, SWR_CACHE_KEYS } from "../utils/constants/swr"

export const notificationFetchHandler = (state, options) => {
  const {
    getNotifications,
    getNotification,
    getFilterNotifications,
    getSearchNotifications,
    getNotesNotifications,
    getContainerNotifications,
    getManteinanceNotifications,
    getBehaviourNotifications,
    getFixedNotifications
  } = useNotificationApi()

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.notifications, getNotifications),
    id: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.notification, options[fetchOption.ID]],
        getNotification
      ),

    filter: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.filterNotifications, options[fetchOption.FILTER]],
        getFilterNotifications
      ),
    search: () =>
      useFetchSWR(
        [SWR_CACHE_KEYS.searchNotifications, options[fetchOption.SEARCH]],
        getSearchNotifications
      ),

    notes: () =>
      useFetchSWR(SWR_CACHE_KEYS.notesNotifications, getNotesNotifications),
    containers: () =>
      useFetchSWR(SWR_CACHE_KEYS.containersNotifications, getContainerNotifications),
    manteinance: () =>
      useFetchSWR(
        SWR_CACHE_KEYS.manteinanceNotifications,
        getManteinanceNotifications
      ),
    behaviour: () =>
      useFetchSWR(SWR_CACHE_KEYS.behaviourNotifications, getBehaviourNotifications),
    fixed: () =>
      useFetchSWR(SWR_CACHE_KEYS.fixedNotifications, getFixedNotifications)
  }

  return fetchHandler[state]()
}
