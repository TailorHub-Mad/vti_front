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
  const deleteNotification = (/*id*/) => execute(instance.delete(``))

  // GROUP & FILTER
  const getFilterNotifications = (data) => console.log("onFilter", data)
  const getSearchNotifications = (data) => console.log("onSearch", data)

  const getNotesNotifications = () => console.log("on filter notes")
  const getContainerNotifications = () => console.log("on filter container")
  const getManteinanceNotifications = () => console.log("on filter manteinance")
  const getBehaviourNotifications = () => console.log("on filter behaviour")
  const getFixedNotifications = () => console.log("on filter fixed")

  return {
    getNotifications,
    getNotification,
    createNotification,
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
