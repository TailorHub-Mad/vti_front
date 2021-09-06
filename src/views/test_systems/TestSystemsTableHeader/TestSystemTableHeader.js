import { DeleteIcon } from "@chakra-ui/icons"
import { Checkbox, Flex, Text } from "@chakra-ui/react"
import React from "react"

export const TestSystemTableHeader = ({
  testSystemsCount = 0,
  selectedRows,
  deleteItems,
}) => {
  return (
    <Flex justify="space-between" align="center" pb="32px">
      <Flex>
        <Checkbox mr="8px" />
        {selectedRows?.length > 0 ? (
          <Flex
            alignItems="center"
            justifyContent="center"
            onClick={() => deleteItems(selectedRows)}
            cursor="pointer"
          >
            <DeleteIcon mr="8px" color="error" />
            <Text color="error">Eliminar</Text>
          </Flex>
        ) : null}
      </Flex>
      <Flex align="center">
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${testSystemsCount} Sistemas de ensayo`}
        </Text>
      </Flex>
    </Flex>
  )
}
