import { Flex } from "@chakra-ui/layout"
import React from "react"
import { GroupNotificationsRow } from "./GroupNotificationsRow"
import { groupTable } from "./utils"

export const NotificationsGroup = ({ notifications, onDelete, onPin }) => {
  const formatNotifications = groupTable(notifications)

  return (
    <Flex flexDirection="column">
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
    </Flex>
  )
}
