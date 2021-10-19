import React from "react"
import { Table } from "../../../components/tables/Table/Table"
import { TABLE_COMPONENTS, TABLE_STYLE } from "../../../utils/constants/tables"
import { formatSubscription, TABLE_SUBSCRIPTIONS_HEAD } from "./utils"

export const SubscriptionsTable = ({ subscriptions, handleSortElement }) => {
  const subscriptionsData = formatSubscription(subscriptions)
  const configTable = {
    components: TABLE_COMPONENTS,
    head: TABLE_SUBSCRIPTIONS_HEAD
  }

  return (
    <Table
      {...TABLE_STYLE}
      config={configTable}
      content={subscriptionsData}
      handleSortElement={handleSortElement}
    />
  )
}
