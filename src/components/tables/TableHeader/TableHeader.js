import { DeleteIcon } from "@chakra-ui/icons"
import { Checkbox, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"

export const TableHeader = ({
  count = 0,
  countLabel = "",
  checked = false,
  selectedRows,
  onDelete,
  selectAllRows = () => {}
}) => {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])
  return (
    <Flex justify="space-between" align="center" pb="32px">
      <Flex>
        <Checkbox mr="8px" onChange={selectAllRows} isChecked={isChecked} />
        {Object.keys(selectedRows)?.length > 0 ? (
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
          {`${count} ${countLabel}`}
        </Text>
      </Flex>
    </Flex>
  )
}
