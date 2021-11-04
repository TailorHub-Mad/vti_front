import { Box, Grid, Text } from "@chakra-ui/layout"
import React from "react"
import { NotificationCard } from "../../../components/cards/NotificationCard/NotificationCard"
import { capitalize } from "../../../utils/functions/global"

export const GroupNotificationsRow = ({ item, onDelete, onPin }) => {
  return (
    <Box width="100%">
      <Text pt="35px" pb={"8px"} variant="d_s_medium" color="grey">
        {capitalize(item.key)}
      </Text>
      <Grid
        templateColumns={["auto", null, null, "repeat(auto-fill, 428px)"]}
        pr={["8px", null, null, null]}
        gap="16px"
        width="100%"
        marginBottom="32px"
      >
        {item.value.map((notification, idx) => (
          <NotificationCard
            key={`${notification._id}-${idx}`}
            notification={notification}
            onPin={onPin}
            onDelete={onDelete}
          />
        ))}
      </Grid>
    </Box>
  )
}
