import NotificationService from "../../services/notification.service"

const useNotificationApi = () => {
  const noteService = NotificationService()

  // CRUD
  const getNotifications = () => noteService.getNotifications()
  const getNotification = (_, id) => noteService.getNotification(id)
  const createNotification = (data) => noteService.createNotification(data)
  const updateNotification = (id, data) => noteService.updateNotification(id, data)
  const deleteNotification = (id) => noteService.deleteNotification(id)

  // GROUP & FILTER
  const getFilterNotifications = (_, data) =>
    noteService.getFilterNotifications(data)
  const getSearchNotifications = (_, data) =>
    noteService.getSearchNotifications(data)

  const getNotesNotifications = () => noteService.getNotesNotifications()
  const getContainerNotifications = () => noteService.getContainerNotifications()
  const getManteinanceNotifications = () => noteService.getManteinanceNotifications()
  const getBehaviourNotifications = () => noteService.getBehaviourNotifications()
  const getFixedNotifications = () => noteService.getFixedNotifications()

  return {
    getNotifications,
    getNotification,
    createNotification,
    updateNotification,
    deleteNotification,

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
