import React, { useContext, useEffect, useState } from "react"
import { NotificationDrawer } from "../components/drawer/NotificationDrawer/NotificationDrawer"
import { NotificationActiveLineIcon } from "../components/icons/NotificationActiveLineIcon"
import { Page } from "../components/layout/Pages/Page"
import { PageBody } from "../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../components/navigation/ToolBar/ToolBar"
import { Popup } from "../components/overlay/Popup/Popup"
import useNotificationApi from "../hooks/api/useNotificationApi"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { ToastContext } from "../provider/ToastProvider"
import { notificationFetchHandler } from "../swr/notification.swr"
import { NOTIFICATIONS_FILTER_KEYS } from "../utils/constants/filter"
import { fetchOption, fetchType } from "../utils/constants/swr"
import { errorHandler } from "../utils/errors"
import { generateFilterQuery } from "../utils/functions/filter"
import { checkDataIsEmpty, getFieldGRoupObjectById } from "../utils/functions/global"
import { LoadingView } from "../views/common/LoadingView"
import { ViewEmptyState } from "../views/common/ViewEmptyState"
import { ViewNotFoundState } from "../views/common/ViewNotFoundState"
import { NewNotificationModal } from "../views/notifications/NewNotification/NewNotificationModal/NewNotificationModal"
import { NotificationsFilterModal } from "../views/notifications/NotificationsFilter/NotificationsFilterModal"
import { NotificationsMenu } from "../views/notifications/NotificationsMenu/NotificationsMenu"

const notificaciones = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteNotification } = useNotificationApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [showFilterModal, setShowFilterModal] = useState(false)

  const [showNotificationDetails, setShowNotificationDetails] = useState(false)
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

  // const handleNotificationsData = (isEmptyData) => {
  //   if (!data || isEmptyData) return null
  //   if (fetchState == fetchType.GROUP) return data
  //   return data[0]?.notifications

  //   // TODO FILTER
  // }

  // const isEmptyData = checkDataIsEmpty(data)
  // const notificationsData = handleNotificationsData(isEmptyData)

  // PROVISIONAL
  console.log(data)
  checkDataIsEmpty()
  const isEmptyData = true
  const notificationsData = []

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const isMenuHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.FILTER) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleOnCloseModal = () => {
    setNotificationToUpdate(null)
    setIsNotificationModalOpen(false)
  }

  // const handleOpenDetail = (notification) => {
  //   setNotificationToDetail(notification)
  //   setShowNotificationDetails(true)
  // }

  const handleOnOpenFilter = () => {
    if (fetchState === fetchType.FILTER) handleOnFilter(null)
    else setShowFilterModal(true)
  }

  // Handlers CRUD
  const handleDeleteMessageToNotification = () => {
    if (!notificationToDelete) return

    const label = getFieldGRoupObjectById(
      notificationsData,
      "name",
      notificationToDelete.id,
      notificationToDelete.key
    )
    return `¿Desea eliminar ${label}?`
  }

  const handleDelete = async () => {
    try {
      await deleteNotification(notificationToDelete)
      showToast("Apunte borrado correctamente")

      const updatedNotifications = []
      const filterNotifications = notificationsData.filter(
        (notification) => notification._id !== notificationToDelete
      )
      updatedNotifications.push({
        notifications: filterNotifications
      })

      updatedNotifications[0].notifications.length > 0
        ? await mutate(updatedNotifications, false)
        : await mutate()

      if (showNotificationDetails) setShowNotificationDetails(false)
      setNotificationToDelete(null)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const notification = notificationsData.find(
      (notification) => notification._id === id
    )
    setNotificationToUpdate(notification)
    setIsNotificationModalOpen(true)
  }

  // Filters
  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.SEARCH]: null
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: search
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

    const filter = generateFilterQuery(NOTIFICATIONS_FILTER_KEYS, values)

    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })

    setShowFilterModal(false)
  }

  useEffect(() => {
    if (!notificationToDetail) return

    const newNotificationToDetail = notificationsData.find(
      (notification) => notification._id === notificationToDetail._id
    )

    if (!newNotificationToDetail) return

    setNotificationToDetail(newNotificationToDetail)
  }, [notificationsData])

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
        {handleDeleteMessageToNotification()}
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

      <NotificationDrawer
        notification={notificationToDetail}
        isOpen={showNotificationDetails}
        onClose={() => setShowNotificationDetails(false)}
        onDelete={() => setNotificationToDelete(notificationToDetail._id)}
        onEdit={() => handleUpdate(notificationToDetail._id)}
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
            icon={<NotificationActiveLineIcon />}
            fetchState={fetchState}
            noGroup
            noImport
          />
        )}
      </PageHeader>
      <PageMenu>
        {isMenuHidden() ? (
          <NotificationsMenu
            fetchState={fetchState}
            notificationsCount={notificationsData?.length}
            onChange={(state) => setFetchState(state)}
          />
        ) : null}
      </PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData && fetchState !== fetchType.ALL ? (
          <ViewNotFoundState />
        ) : isEmptyData ? (
          <ViewEmptyState
            message="Añadir notificaciones a la plataforma"
            addButtonText="Añadir notificación"
            onAdd={() => setIsNotificationModalOpen(true)}
            noImport
          />
        ) : null}

        {/* {notificationsData ? (
          <>
            {fetchState === fetchType.GROUP ? (
              <NotificationsGroup
                notifications={notificationsData}
                onSeeDetails={handleOpenDetail}
                subscribedUsers={null} // TOPO -> review
                checkIsSubscribe={checkIsSubscribe}
                checkIsFavorite={checkIsFavorite}
                onDelete={(id, key) => setNotificationToDelete({ id, key })}
                onGroup={handleOnGroup}
                handleFavorite={handleFavorite}
                groupOption={getGroupOptionLabel(
                  NOTIFICATIONS_GROUP_OPTIONS,
                  fetchOptions[fetchOption.GROUP]
                )}
                isGrouped={isGrouped}
                fetchState={fetchState}
              />
            ) : (
              <NotificationsGrid
                notifications={notificationsData}
                onSeeDetails={handleOpenDetail}
                subscribedUsers={null} // TOPO -> review
                checkIsSubscribe={checkIsSubscribe}
                checkIsFavorite={checkIsFavorite}
                onDelete={setNotificationToDelete}
                handleFavorite={handleFavorite}
              />
            )}
          </>
        ) : null} */}
      </PageBody>
    </Page>
  )
}

export default notificaciones
