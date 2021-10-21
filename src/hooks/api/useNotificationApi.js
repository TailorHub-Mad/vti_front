import NotificationService from "../../services/notification.service"

const useNotificationApi = () => {
  const notificationService = NotificationService()

  // CRUD
  const getNotifications = () => notificationService.getNotifications()
  const getNotification = (_, id) => notificationService.getNotification(id)
  const createNotification = (data) => notificationService.createNotification(data)
  const deleteNotification = (id) => notificationService.deleteNotification(id)
  const pinNotification = (id) => notificationService.pinNotification(id)

  // GROUP & FILTER
  const getFilterNotifications = (_, data) =>
    notificationService.getFilterNotifications(data)
  const getSearchNotifications = (_, data) =>
    notificationService.getSearchNotifications(data)

  const getNotesNotifications = () => notificationService.getNotesNotifications()
  const getContainerNotifications = () =>
    notificationService.getContainerNotifications()
  const getManteinanceNotifications = () =>
    notificationService.getManteinanceNotifications()
  const getBehaviourNotifications = () =>
    notificationService.getBehaviourNotifications()
  const getFixedNotifications = () => notificationService.getFixedNotifications()

  return {
    getNotifications,
    getNotification,
    createNotification,
    deleteNotification,
    pinNotification,

    getFilterNotifications,
    getSearchNotifications,
    getNotesNotifications,
    getContainerNotifications,
    getManteinanceNotifications,
    getBehaviourNotifications,
    getFixedNotifications
  }
}

export default useNotificationApi
