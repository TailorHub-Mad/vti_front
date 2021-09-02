import { chakra, Checkbox, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { ICONS_REFERENCE } from "../../../utils/constants/icons_reference"

export const ClientsTableHeader = ({ clientsCount = 0 }) => {
  return (
    <Flex justify="space-between" align="center" pb="32px">
      <Flex>
        <Checkbox mr="8px" />
      </Flex>
      <Flex align="center">
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${clientsCount} Clientes`}
        </Text>
      </Flex>
    </Flex>
  )
}
