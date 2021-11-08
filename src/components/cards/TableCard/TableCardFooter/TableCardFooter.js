import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { NoteMobileIcon } from "../../../icons/NoteMobileIcon"
import { UsersLineIcon } from "../../../icons/UsersLineIcon"

const icon_props = {
  width: "16px",
  height: "16px",
  color: "grey",
  cursor: "default"
}

export const TableCardFooter = ({ users, notes, ...props }) => {
  return (
    <Flex
      justifyContent="space-between"
      height="24px"
      alignItems="center"
      {...props}
    >
      <Flex alignItems="center">
        <Text mt="4px" variant="d_s_regular" marginRight="2px">
          {users}
        </Text>
        <UsersLineIcon {...icon_props} color="blue.500" />
      </Flex>
      <Flex alignItems="center">
        <Text variant="d_s_regular" marginRight="2px">
          {notes}
        </Text>
        <NoteMobileIcon mt="4px" w="16px" h="16px" />
      </Flex>
    </Flex>
  )
}
