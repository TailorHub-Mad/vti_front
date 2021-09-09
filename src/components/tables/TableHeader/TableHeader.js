import { DeleteIcon } from "@chakra-ui/icons"
import { Checkbox, Flex, Text } from "@chakra-ui/react"
import React from "react"

export const TableHeader = ({
  count = 0,
  countLable = "",
  selectedRows,
  onDelete,
  selectAllRows = () => {},
}) => {
  return (
    <Flex justify="space-between" align="center" pb="32px">
      <Flex>
        <Checkbox mr="8px" onChange={selectAllRows} />
        {selectedRows?.length > 0 ? (
          <Flex
            alignItems="center"
            justifyContent="center"
            onClick={() => onDelete(selectedRows)}
            cursor="pointer"
          >
            <DeleteIcon mr="8px" color="error" />
            <Text color="error" marginTop="6px">
              Eliminar
            </Text>
          </Flex>
        ) : null}
      </Flex>
      <Flex align="center">
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${count} ${countLable}`}
        </Text>
      </Flex>
    </Flex>
  )
}
