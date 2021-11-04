import { AttachmentIcon } from "@chakra-ui/icons"
import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { UsersLineIcon } from "../../../icons/UsersLineIcon"

const icon_props = {
  width: "16px",
  height: "16px",
  color: "grey",
  cursor: "default"
}

export const TableCardFooter = ({ users, attachments, ...props }) => {
  return (
    <Flex
      justifyContent="space-between"
      height="24px"
      alignItems="center"
      {...props}
    >
      <Flex alignItems="center">
        <UsersLineIcon {...icon_props} />
        <Text variant="d_xs_regular" marginRight="2px">
          {users}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <AttachmentIcon {...icon_props} />
        <Text variant="d_xs_regular" marginRight="2px">
          {attachments}
        </Text>
      </Flex>
    </Flex>
  )
}
