import { ServiceConstructor } from "."

const NotificationService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getNotifications = (limit = 0, offset = 0) =>
    execute(instance.get(`/notification?limit=${limit}&offset=${offset}`))
  const getNotification = (/*id*/) => execute(instance.get(``))
  const createNotification = (data) =>
    execute(instance.post(`/notification/create`, data))
  const deleteNotification = (id) => execute(instance.delete(`/notification/${id}`))
  const pinNotification = (id) => execute(instance.get(`/notification/pin/${id}`))

  // GROUP & FILTER
  const getFilterNotifications = (data) =>
    execute(instance.get(`/notification?type=${data}`))
  const getSearchNotifications = (data) =>
    execute(instance.get(`/notification?date=${data}`))

  const getNotesNotifications = () =>
    execute(instance.get(`/notification?type=Apunte respondido&type=Apunte creado`))
  const getContainerNotifications = () =>
    execute(
      instance.get(`/notification?type=Nuevo Proyecto&type=Nuevo sistema de ensayo`)
    )
  const getManteinanceNotifications = () =>
    execute(instance.get(`/notification?type=Notificación mantenimiento`))
  const getBehaviourNotifications = () =>
    execute(
      instance.get(
        `/notification?type=Nuevo tag de apunte&type=Nuevo tag de proyecto`
      )
    )
  const getFixedNotifications = () => execute(instance.get(`/notification?pin=true`))

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

export default NotificationService
