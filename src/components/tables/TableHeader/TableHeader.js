import { CloseIcon, DeleteIcon } from "@chakra-ui/icons"
import { Checkbox, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { fetchType } from "../../../utils/constants/swr"

export const TableHeader = ({
  count = 0,
  countLabel = "",
  checked = false,
  selectedRows,
  onDelete,
  selectAllRows = () => {},
  fetchState,
  onGroup,
  groupOption
}) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleOnClick = () => onGroup(null)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  return (
    <Flex justify="space-between" align="center" pb="32px">
      {fetchState === fetchType.GROUP ? (
        <Flex alignItems="center">
          <CloseIcon mr="8px" h="12px" cursor="pointer" onClick={handleOnClick} />
          <Text marginTop="6px">{`Filtrado por ${groupOption
            .toString()
            .toUpperCase()}`}</Text>
        </Flex>
      ) : (
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
      )}
      <Flex align="center">
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${count} ${countLabel}`}
        </Text>
      </Flex>
    </Flex>
  )
}
