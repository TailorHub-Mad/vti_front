import { ServiceConstructor } from "."

const NotificationService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNotifications = (limit = 0, offset = 0) =>
    execute(instance.get(`/projects?limit=${limit}&offset=${offset}`))
  const getNotification = (/*id*/) => execute(instance.get(``))
  const createNotification = (data) =>
    execute(
      instance.post(``, data, {
        headers: { "content-type": "multipart/form-data" }
      })
    )
  const updateNotification = (/*id*/ data) => execute(instance.put(``, data))
  const deleteNotification = (/*id*/) => execute(instance.delete(``))

  // GROUP & FILTER
  const getFilterNotifications = (/*data*/) => execute(instance.get(``))
  const getSearchNotifications = (/*data*/) => execute(instance.get(``))

  const getNotesNotifications = () => execute(instance.get(``))
  const getContainerNotifications = () => execute(instance.get(``))
  const getManteinanceNotifications = () => execute(instance.get(``))
  const getBehaviourNotifications = () => execute(instance.get(``))
  const getFixedNotifications = () => execute(instance.get(``))

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

export default NotificationService
