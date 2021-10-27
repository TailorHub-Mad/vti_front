import { isEmpty } from "lodash"
import React, { useContext, useEffect, useState } from "react"
import { AddNotificationIcon } from "../components/icons/AddNotificationIcon"
import { Page } from "../components/layout/Pages/Page"
import { PageBody } from "../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../components/navigation/ToolBar/ToolBar"
import { Popup } from "../components/overlay/Popup/Popup"
import useNotificationApi from "../hooks/api/useNotificationApi"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { NotificationContext } from "../provider/NotificationProvider"
import { ToastContext } from "../provider/ToastProvider"
import { notificationFetchHandler } from "../swr/notification.swr"
import { fetchOption, fetchType } from "../utils/constants/swr"
import { errorHandler } from "../utils/errors"
import { destructuringDate, formatDateToFetch } from "../utils/functions/date"
import { LoadingView } from "../views/common/LoadingView"
import { ViewEmptyState } from "../views/common/ViewEmptyState"
import { ViewNotFoundState } from "../views/common/ViewNotFoundState"
import { NewNotificationModal } from "../views/notifications/NewNotification/NewNotificationModal/NewNotificationModal"
import { NotificationsFilterModal } from "../views/notifications/NotificationsFilter/NotificationsFilterModal"
import { NotificationsGroup } from "../views/notifications/NotificationsGroup/NotificationsGroup"
import { NotificationsMenu } from "../views/notifications/NotificationsMenu/NotificationsMenu"

const notificaciones = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteNotification, pinNotification } = useNotificationApi()
  const { showToast } = useContext(ToastContext)
  const { newNotification, setNewNotification } = useContext(NotificationContext)

  // States
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notificationToUpdate, setNotificationToUpdate] = useState(null)
  const [notificationToDetail, setNotificationToDetail] = useState(null)
  const [notificationToDelete, setNotificationToDelete] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate } = notificationFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleNotificationsData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    return data
  }

  const isEmptyData = isEmpty(data)
  const notificationsData = handleNotificationsData(isEmptyData)

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const isMenuHidden = () => {
    if (isLoading) return false
    if (fetchState === fetchType.FILTER) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleOnCloseModal = () => {
    setNotificationToUpdate(null)
    setIsNotificationModalOpen(false)
  }

  const handleOnOpenFilter = () => {
    if (fetchState === fetchType.FILTER) handleOnFilter(null)
    else setShowFilterModal(true)
  }

  const handleNotificationsCount = () => {
    if (!notificationsData) return
    return Object.values(notificationsData).reduce((acc, values) => {
      return acc + values.length
    }, 0)
  }

  // Handlers CRUD
  const handleDelete = async () => {
    try {
      await deleteNotification(notificationToDelete)
      showToast({ message: "Notificación borrada correctamente" })
      await mutate()
      setNotificationToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnPin = async (id) => {
    try {
      await pinNotification(id)
      await mutate()
    } catch (error) {
      errorHandler(error)
    }
  }

  // Filters
  const onSearch = (search) => {
    const date = destructuringDate(new Date(search))
    if (!search) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.SEARCH]: null
      })
      return
    }
    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: formatDateToFetch(date)
    })
  }

  const handleOnFilter = (values) => {
    if (!values) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.FILTER]: null
      })
      return
    }

    const filter = values.join("&type=")

    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })

    setShowFilterModal(false)
  }

  useEffect(() => {
    setNewNotification(false)
    if (!notificationToDetail) return

    const newNotificationToDetail = notificationsData.find(
      (notification) => notification._id === notificationToDetail._id
    )

    if (!newNotificationToDetail) return

    setNotificationToDetail(newNotificationToDetail)
  }, [notificationsData])

  useEffect(() => {
    if (!newNotification) return
    setNewNotification(false)
  }, [])

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={notificationToDelete}
        onConfirm={handleDelete}
        onClose={() => setNotificationToDelete(null)}
      >
        ¿Desea eliminar la notficación seleccionada?
      </Popup>

      <NotificationsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onFilter={(values) => handleOnFilter(values)}
      />

      <NewNotificationModal
        notificationToUpdate={notificationToUpdate}
        isOpen={isNotificationModalOpen}
        onClose={handleOnCloseModal}
      />

      <PageHeader>
        <BreadCrumbs />
        {isToolbarHidden() && (
          <ToolBar
            onAdd={() => setIsNotificationModalOpen(true)}
            onSearch={onSearch}
            onFilter={handleOnOpenFilter}
            addLabel="Añadir notificación"
            searchPlaceholder="Busqueda por ID, Proyecto"
            icon={<AddNotificationIcon />}
            fetchState={fetchState}
            noGroup
            noImport
            searchDate
          />
        )}
      </PageHeader>
      <PageMenu>
        {isMenuHidden() ? (
          <NotificationsMenu
            fetchState={fetchState}
            notificationsCount={handleNotificationsCount()}
            onChange={(state) => setFetchState(state)}
          />
        ) : null}
      </PageMenu>
      <PageBody
        overflowY={isEmptyData ? "hidden" : "scroll"}
        height="calc(100vh - 140px)"
      >
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData ? (
          <ViewNotFoundState noBack text="No hay notificaciones" />
        ) : isEmptyData ? (
          <ViewEmptyState
            message="Añadir notificaciones a la plataforma"
            addButtonText="Añadir notificación"
            onAdd={() => setIsNotificationModalOpen(true)}
            noImport
          />
        ) : (
          <NotificationsGroup
            notifications={notificationsData}
            onDelete={(id) => setNotificationToDelete(id)}
            onPin={handleOnPin}
          />
        )}
      </PageBody>
    </Page>
  )
}

export default notificaciones
