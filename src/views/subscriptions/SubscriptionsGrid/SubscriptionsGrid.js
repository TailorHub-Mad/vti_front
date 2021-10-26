import { Grid } from "@chakra-ui/layout"
import React, { useMemo } from "react"
import { SubscriptionCard } from "../../../components/cards/SubscriptionCard/SubscriptionCard"

export const SubscriptionsGrid = ({
  subscriptions,
  owner,
  onDelete,
  selectedRows,
  setSelectedRows,
  handleRowSelect,
  currentState
}) => {
  useMemo(() => {
    setSelectedRows && setSelectedRows([])
  }, [subscriptions?.length])

  return (
    <Grid
      templateColumns="repeat(auto-fill, 282px)"
      gap="16px"
      width="100%"
      marginBottom="32px"
    >
      {subscriptions?.map((subscription, idx) => {
        return (
          <SubscriptionCard
            key={`${subscription.title}-${idx}`}
            currentState={currentState}
            subscription={subscription}
            owner={owner}
            onDelete={() => onDelete(subscription._id)}
            onCardSelected={() => handleRowSelect(subscription._id)}
            isChecked={selectedRows[subscription._id]}
          />
        )
      })}
    </Grid>
  )
}
