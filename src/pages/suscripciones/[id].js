import { Text } from "@chakra-ui/layout"
import React, { useContext, useState } from "react"
import { Page } from "../../components/layout/Pages/Page"
import { PageBody } from "../../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../../components/layout/Pages/PageMenu/PageMenu"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { Popup } from "../../components/overlay/Popup/Popup"
import useSubscriptionApi from "../../hooks/api/useSubscriptionApi"
import useTableActions from "../../hooks/useTableActions"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { ToastContext } from "../../provider/ToastProvider"
import { subscriptionFetchHandler } from "../../swr/subscription.swr"
import { DeleteType, PATHS } from "../../utils/constants/global"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { errorHandler } from "../../utils/errors"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/global"
import { LoadingView } from "../../views/common/LoadingView"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import { SubscriptionsGrid } from "../../views/subscriptions/SubscriptionsGrid/SubscriptionsGrid"
import { SubscriptionsMenu } from "../../views/subscriptions/SubscriptionsMenu/SubscriptionsMenu"

const mock = {
  _id: "lajsdlfkjlaskdjfljlasñdj",
  name: "Maria Losada",
  subscriptions: [
    {
      _id: "lkjadlfkjalsdkf90wq8r09834",
      title: "Suscripción prueba",
      client: "CL-0001",
      updatedAt: new Date(),
      tags: [
        {
          name: "Tag apunte 1"
        },
        {
          name: "Tag apunte 2"
        },
        {
          name: "Tag apunte 3"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        }
      ]
    },
    {
      _id: "lkjadlfkjalsdkf90wq8afsdfdsr09834",
      title: "Suscripción prueba",
      client: "CL-0001",
      updatedAt: new Date(),
      tags: [
        {
          name: "Tag apunte 1"
        },
        {
          name: "Tag apunte 2"
        },
        {
          name: "Tag apunte 3"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        },
        {
          name: "Tag apunte 4"
        }
      ]
    }
  ]
}

const suscripcion = () => {
  // Hooks
  const { selectedRows, setSelectedRows, handleRowSelect, handleSelectAllRows } =
    useTableActions()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteSubscription } = useSubscriptionApi()
  const { showToast } = useContext(ToastContext)

  // States

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const [deleteType, setDeleteType] = useState(null)
  const [subscriptionsToDelete, setSubscriptionsToDelete] = useState(null)

  // Fetch
  const { data, error, isLoading, mutate } = subscriptionFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleSubscriptionsData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState == fetchType.GROUP) return data
    return mock.subscriptions
  }

  const isEmptyData = checkDataIsEmpty(data)
  const subscriptionsData = handleSubscriptionsData(isEmptyData)

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
  }

  const isMenuHidden = () => {
    if (isLoading) return false
    if (fetchState === fetchType.GROUP) return false
    if (isEmptyData && fetchState === fetchType.FILTER) return false
    if (isEmptyData && fetchState === fetchType.ALL) return false

    return true
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
          {"¿Desea eliminar las"}{" "}
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
        {"¿Desea eliminar"}{" "}
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
    const updated = await f(subscriptionsToDelete, subscriptionsData)
    updated.length > 0 ? await mutate(updated, false) : await mutate()
    setDeleteType(null)
    setSubscriptionsToDelete(null)
  }

  const deleteOne = async (id, subscriptions) => {
    try {
      await deleteSubscription(id)
      showToast("Suscripción borrada correctamente")
      return subscriptions.filter((subscription) => subscription._id !== id)
    } catch (error) {
      errorHandler(error)
    }
  }

  const deleteMany = async (subscriptionsId, subscriptions) => {
    try {
      const subscriptionsQueue = subscriptionsId.map((id) => deleteSubscription(id))
      await Promise.all(subscriptionsQueue)
      showToast("Suscripciones borradas correctamente")
      return subscriptions.filter(
        (subscription) => !subscriptionsId.includes(subscription._id)
      )
    } catch (error) {
      errorHandler(error)
    }
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

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={subscriptionsToDelete}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
      </Popup>

      <PageHeader>
        <BreadCrumbs customURL={`${PATHS.subscriptions}/${mock?.name}`} />
        {isToolbarHidden() && (
          <ToolBar
            onSearch={onSearch}
            searchPlaceholder="Buscar"
            fetchState={fetchState}
            noAdd
            noImport
            noFilter
            noGroup
          />
        )}
      </PageHeader>
      <PageMenu>
        {isMenuHidden() ? (
          <SubscriptionsMenu
            currentState={"projects"} // provisional
            subscriptionsCount={subscriptionsData?.length}
            onChange={(state) => console.log(state)}
            handleSelectAllRows={() => handleSelectAllRows(subscriptionsData)}
            isChecked={
              Object.keys(selectedRows)?.length === subscriptionsData?.length
            }
            selectedRows={selectedRows}
            onDelete={handleOnDelete}
          />
        ) : null}
      </PageMenu>
      <PageBody height="calc(100vh - 140px)">
        {isLoading ? <LoadingView mt="-200px" /> : null}
        {isEmptyData && fetchState !== fetchType.ALL ? <ViewNotFoundState /> : null}
        {subscriptionsData ? (
          <SubscriptionsGrid
            subscriptions={subscriptionsData}
            onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            handleRowSelect={handleRowSelect}
          />
        ) : null}
      </PageBody>
    </Page>
  )
}

export default suscripcion
