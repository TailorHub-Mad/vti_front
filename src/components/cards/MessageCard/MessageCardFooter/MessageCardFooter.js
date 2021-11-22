import { AttachmentIcon } from "@chakra-ui/icons"
import { Box, Circle, Grid, Text } from "@chakra-ui/react"
import React from "react"
import { getAcronym } from "../../../../utils/functions/global"
import { BadgeIcon } from "../../../icons/BadgeIcon"
import { LockCloseIcon } from "../../../icons/LockCloseIcon"
import { LockOpenIcon } from "../../../icons/LockOpenIcon"
import { MessagesIcon } from "../../../icons/MessagesIcon"
import { SubscribeIcon } from "../../../icons/SubscribeIcon"

const icon_props = {
  width: "16px",
  height: "16px",
  color: "grey",
  cursor: "default"
}

export const MessageCardFooter = ({
  isClosed,
  isSubscribe,
  isFormalized,
  messagesCount = 0,
  attachmentsCount = 0,
  subscribedUsers,
  isRead,
  ...props
}) => {
  const areMultipleUsers = subscribedUsers?.length > 1
  return (
    <Grid
      height="24px"
      alignItems="center"
      templateColumns="24px 24px 24px 24px 24px 42px"
      justifyContent="space-between"
      {...props}
    >
      {isClosed ? (
        <LockCloseIcon {...icon_props} fill="blue.500" />
      ) : (
        <LockOpenIcon {...icon_props} fill="#C4C4C4" />
      )}

      <SubscribeIcon {...icon_props} color={isSubscribe ? "blue.500" : "#C4C4C4"} />

      <BadgeIcon {...icon_props} color={isFormalized ? "blue.500" : "#C4C4C4"} />

      <Box display="flex" alignItems="center">
        <Text
          color={isRead ? "grey" : "yellow"}
          variant="d_xs_regular"
          marginRight="2px"
        >
          {messagesCount}
        </Text>
        <MessagesIcon {...icon_props} color={isRead ? "grey" : "yellow"} />
      </Box>

      <Box display="flex" alignItems="center">
        <Text
          color={attachmentsCount === 0 ? "grey" : "yellow"}
          variant="d_xs_regular"
          marginRight="2px"
        >
          {attachmentsCount}
        </Text>
        <AttachmentIcon
          {...icon_props}
          color={attachmentsCount === 0 ? "grey" : "yellow"}
        />
      </Box>

      {subscribedUsers ? (
        <Box w="42px" h="24px" position="relative">
          {areMultipleUsers ? (
            <Circle size="24px" position="absolute" top="0" right="0" bg="blue_alt">
              <Text color="white" transform="uppercase" variant="d_xs_regular">
                {`+${subscribedUsers?.length - 1}`}
              </Text>
            </Circle>
          ) : null}
          <Circle
            size="24px"
            position="absolute"
            top="0"
            left={areMultipleUsers ? "0" : "auto"}
            right="0"
            zIndex="1"
            bg="blue.500"
          >
            <Text color="white" transform="uppercase" variant="d_xs_regular">
              {getAcronym(subscribedUsers[0])}
            </Text>
          </Circle>
        </Box>
      ) : null}
    </Grid>
  )
}
