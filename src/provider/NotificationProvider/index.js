import React, { useEffect, useState } from "react"
import useNotificationApi from "../../hooks/api/useNotificationApi"
import useFetchSWR from "../../hooks/useFetchSWR"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { isEmpty } from "lodash"

export const NotificationContext = React.createContext()

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(null)
  const [newNotification, setNewNotification] = useState(false)

  const { getNotifications } = useNotificationApi()

  const { data } = useFetchSWR(SWR_CACHE_KEYS.notifications, getNotifications, 10000)

  const handleNotificationsData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    return data
  }

  const isEmptyData = isEmpty(data)
  const notificationsData = handleNotificationsData(isEmptyData)

  const getSizeNotifications = (notifications) => {
    if (!notifications) return

    return Object.values(notifications).reduce(
      (acc, val) => {
        const size = val.length
        return +acc + size
      },
      [0]
    )
  }

  useEffect(() => {
    if (!notificationsData) return

    const notificationsDataSize = getSizeNotifications(notificationsData)
    const notificationsSize = getSizeNotifications(notifications)

    if (notifications && notificationsDataSize > notificationsSize)
      setNewNotification(true)

    setNotifications(notificationsData)
  }, [notificationsData])

  const contextValue = {
    newNotification,
    setNewNotification
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
