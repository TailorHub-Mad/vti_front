import { Flex, Grid } from "@chakra-ui/layout"
import React from "react"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/tables"
import { GroupNotificationsRow } from "./GroupNotificationsRow"
import { groupTable } from "./utils"

export const NotificationsGroup = ({ notifications, onDelete, onPin }) => {
  const formatNotifications = groupTable(notifications)

  return (
    <>
      <Flex width="100%" position="relative" overflow="hidden">
        <Grid minWidth={MIN_TABLE_WIDTH} maxWidth={MAX_TABLE_WIDTH} width="100%">
          {formatNotifications.map((item, idx) => {
            return (
              <GroupNotificationsRow
                key={`${item.key}-${idx}`}
                item={item}
                onDelete={onDelete}
                onPin={onPin}
              />
            )
          })}
        </Grid>
      </Flex>
    </>
  )
}
