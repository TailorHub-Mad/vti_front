import { AttachmentIcon } from "@chakra-ui/icons"
import { Box, Circle, Text } from "@chakra-ui/react"
import React from "react"
import { BadgeIcon } from "../../../icons/BadgeIcon"
import { LockCloseIcon } from "../../../icons/LockCloseIcon"
import { LockOpenIcon } from "../../../icons/LockOpenIcon"
import { MessagesIcon } from "../../../icons/MessagesIcon"
import { SubscribeIcon } from "../../../icons/SubscribeIcon"

const icon_props = {
  width: "16px",
  height: "16px",
  color: "grey",
  cursor: "pointer",
}

export const MessageCardFooter = ({
  isClosed,
  canSubscribe,
  onLock,
  onUnlock,
  onSubscribe,
  onValidate,
  seeMessages,
  seeAttachments,
  messagesCount = 0,
  attachmentsCount = 0,
  subscribedUsers,
  ...props
}) => {
  const areMultipleUsers = subscribedUsers?.length > 1
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      height="24px"
      alignItems="center"
      {...props}
    >
      {isClosed ? (
        <LockCloseIcon {...icon_props} onClick={onUnlock} />
      ) : (
        <LockOpenIcon {...icon_props} onClick={onLock} />
      )}
      <BadgeIcon {...icon_props} onClick={onValidate} />
      {canSubscribe ? <SubscribeIcon {...icon_props} onClick={onSubscribe} /> : null}
      <Box display="flex" alignItems="center">
        <Text color="grey" variant="d_xs_regular" marginRight="2px">
          {messagesCount}
        </Text>
        <MessagesIcon {...icon_props} onClick={seeMessages} />
      </Box>
      <Box display="flex" alignItems="center">
        <Text color="grey" variant="d_xs_regular" marginRight="2px">
          {attachmentsCount}
        </Text>
        <AttachmentIcon {...icon_props} onClick={seeAttachments} />
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
              {subscribedUsers[0]}
            </Text>
          </Circle>
        </Box>
      ) : null}
    </Box>
  )
}
