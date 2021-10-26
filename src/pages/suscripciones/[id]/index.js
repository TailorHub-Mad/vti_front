import { Text } from "@chakra-ui/layout"
import { remove } from "lodash"
import { useRouter } from "next/router"
import React, { useContext, useMemo, useState } from "react"
import { Page } from "../../../components/layout/Pages/Page"
import { PageBody } from "../../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../../../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../../components/overlay/Popup/Popup"
import useUserApi from "../../../hooks/api/useUserApi"
import useTableActions from "../../../hooks/useTableActions"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { ToastContext } from "../../../provider/ToastProvider"
import { subscriptionFetchHandler } from "../../../swr/subscription.swr"
import { DeleteType, PATHS } from "../../../utils/constants/global"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import {
  checkDataIsEmpty,
  getFieldObjectById
} from "../../../utils/functions/global"
import { LoadingView } from "../../../views/common/LoadingView"
import { ViewNotFoundState } from "../../../views/common/ViewNotFoundState"
import { NotesGrid } from "../../../views/notes/NotesGrid/NotesGrid"
import { SubscriptionsGrid } from "../../../views/subscriptions/SubscriptionsGrid/SubscriptionsGrid"
import { SubscriptionsMenu } from "../../../views/subscriptions/SubscriptionsMenu/SubscriptionsMenu"

const suscripcion = () => {
  // Hooks
  const router = useRouter()
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()
  const { isLoggedIn, user } = useContext(ApiAuthContext)
  const { showToast } = useContext(ToastContext)
  const { updateUser } = useUserApi()

  // States
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [currentState, setCurrentState] = useState("projects")
  const [currentStateFetch, setCurrentStateFetch] = useState("project")
  const [fetchOptions, setFetchOptions] = useState({
    [fetchOption.FILTER]: currentStateFetch
  })
  const [deleteType, setDeleteType] = useState(null)
  const [subscriptionsToDelete, setSubscriptionsToDelete] = useState(null)

  const [subscriptionsData, setSubscriptionsData] = useState([])

  // Fetch
  const { data, error, isLoading, mutate } = subscriptionFetchHandler(
    fetchState,
    fetchOptions
  )

  console.log("DATA", data)

  const subscriptionId = router.query.id
  const isEmptyData = checkDataIsEmpty(data)
  const subscription =
    data && !isEmptyData ? data.find((d) => d._id === subscriptionId) : null

  const formatSubscriptionProjects = (data) => {
    return data?.map((d) => {
      return {
        _id: d._id,
        title: d.alias,
        updatedAt: d.updatedAt,
        tags: d?.notes?.map((n) => ({ name: n.title }))
      }
    })
  }

  const formatSubscriptionSystem = (data) => {
    return data?.map((d) => {
      return {
        _id: d._id,
        title: d.alias,
        updatedAt: d.updatedAt,
        tags: d?.notes?.map((n) => ({ name: n.title }))
      }
    })
  }

  useMemo(() => {
    if (!subscription) return

    const { subscribed } = subscription

    switch (currentState) {
      case "projects":
        return setSubscriptionsData(
          formatSubscriptionProjects(subscribed[currentState])
        )

      case "notes":
        return setSubscriptionsData(subscribed[currentState])

      case "testSystems":
        return setSubscriptionsData(
          formatSubscriptionSystem(subscribed[currentState])
        )
    }
  }, [subscription, currentState])

  // Handlers views

  const isMenuHidden = () => {
    if (isLoading) return false
    if (fetchState === fetchType.GROUP) return false
    if (isEmptyData && fetchState === fetchType.FILTER) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const handleState = (state) => {
    const fetchState = state === "projects" ? "project" : state

    setFetchOptions({
      [fetchOption.FILTER]: fetchState
    })
    setCurrentState(state)
    setCurrentStateFetch(fetchState)
  }

  // Handlers CRUD
  const handleOpenPopup = (subscriptionsToDelete, type) => {
    setDeleteType(type)
    setSubscriptionsToDelete(subscriptionsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setSubscriptionsToDelete(null)
  }

  const handleDeleteMessage = () => {
    if (!subscriptionsToDelete) return

    if (deleteType === DeleteType.MANY)
      return (
        <Text variant="d_s_regular" textAlign="center" color="error">
          {"¿Desea dar de baja las"}{" "}
          <Text
            display="inline"
            variant="d_s_medium"
            textAlign="center"
            color="error"
          >
            suscripciones seleccionadas
          </Text>
          {"?"}
        </Text>
      )
    const label = getFieldObjectById(
      subscriptionsData,
      "title",
      subscriptionsToDelete
    )
    return (
      <Text variant="d_s_regular" textAlign="center" color="error">
        {"¿Desea dar de baja"}{" "}
        <Text display="inline" variant="d_s_medium" textAlign="center" color="error">
          {label}
        </Text>
        {"?"}
      </Text>
    )
  }

  const handleOnDelete = () => {
    const selected = Object.keys(selectedRows)

    if (selected.length > 1) handleOpenPopup(selected, DeleteType.MANY)
    else handleOpenPopup(selected[0], DeleteType.ONE)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(subscriptionsToDelete, subscriptionsData)
    await mutate()
    setDeleteType(null)
    setSubscriptionsToDelete(null)
  }

  const formatUpdateUsers = (user, subscribed) => {
    return {
      alias: user.alias,
      name: user.name,
      subscribed,
      department: user.department
    }
  }

  const handleSubscribed = async (idUser, newList) => {
    const formatUser = formatUpdateUsers(user, newList)

    await updateUser(idUser, formatUser)
    await mutate()
  }

  const deleteOne = async (id) => {
    try {
      const { subscribed, _id } = user
      const listToUpdate = subscribed[currentState]

      remove(listToUpdate, (e) => e === id)
      subscribed[currentState] = listToUpdate

      await handleSubscribed(_id, subscribed)
      showToast("Suscripción borrada correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (subscriptionsId) => {
    try {
      const { subscribed, _id } = user
      const listToUpdate = subscribed[currentState]

      remove(listToUpdate, (e) => subscriptionsId.includes(e))
      subscribed[currentState] = listToUpdate

      await handleSubscribed(_id, subscribed)
      showToast("Suscripciones borradas correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  // Filters
  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.FILTER]: currentStateFetch
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: { data: currentStateFetch, search }
    })
  }

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <Popup
        variant="twoButtons"
        confirmText="Aceptar"
        cancelText="Cancelar"
        color="error"
        isOpen={subscriptionsToDelete}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
      </Popup>

      <PageHeader>
        <BreadCrumbs
          customURL={`${PATHS.subscriptions}/${subscription?.name || ""}`}
        />
        {!isEmptyData ? (
          <ToolBar
            onSearch={onSearch}
            searchPlaceholder="Buscar"
            fetchState={fetchState}
            noAdd
            noImport
            noFilter
            noGroup
            noSearch={subscriptionsData.length === 0}
          />
        ) : null}
      </PageHeader>
      <PageMenu>
        {isMenuHidden() ? (
          <SubscriptionsMenu
            currentState={currentState}
            subscriptionsCount={subscriptionsData?.length}
            onChange={handleState}
            handleSelectAllRows={() => handleSelectAllRows(subscriptionsData)}
            isChecked={
              Object.keys(selectedRows)?.length === subscriptionsData?.length
            }
            noCheck={subscriptionsData.length === 0}
            selectedRows={selectedRows}
            onDelete={handleOnDelete}
          />
        ) : null}
      </PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {subscriptionsData.length === 0 ? (
          <ViewNotFoundState text="No te has suscrito a nada" noBack />
        ) : currentState === "notes" ? (
          <NotesGrid
            notes={subscription?.subscribed.notes}
            onSeeDetails={() => {}}
            checkIsSubscribe={() => {}}
            checkIsFavorite={() => {}}
            onDelete={() => {}}
            handleFavorite={() => {}}
            handleSubscribe={() => {}}
            notesFromSubscription
          />
        ) : (
          <SubscriptionsGrid
            subscriptions={formatSubscriptionSystem(
              subscription?.subscribed[currentState]
            )}
            currentState={currentState}
            owner={subscription?.name}
            onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            handleRowSelect={handleRowSelect}
          />
        )}
      </PageBody>
    </Page>
  )
}

export default suscripcion
