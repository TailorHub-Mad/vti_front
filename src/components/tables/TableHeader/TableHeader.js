import { CloseIcon, DeleteIcon } from "@chakra-ui/icons"
import { Checkbox, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { fetchType } from "../../../utils/constants/swr"

export const TableHeader = ({
  count = 0,
  countLabel = "",
  checked = false,
  selectedRows = {},
  onDelete,
  selectAllRows = () => {},
  fetchState,
  onGroup,
  onFilter,
  groupOption
}) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleOnClick = () => {
    if (fetchState === fetchType.GROUP) return onGroup(null)
    if (fetchState === fetchType.FILTER) return onFilter(null)
  }

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  return (
    <Flex justify="space-between" align="center" pb="32px">
      {fetchState === fetchType.GROUP ? (
        <Flex
          justify="flex-start"
          alignItems="center"
          cursor="pointer"
          gridGap="16px"
        >
          {Object.keys(selectedRows)?.length > 0 ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              onClick={() => onDelete(selectedRows)}
              cursor="pointer"
            >
              <DeleteIcon mr="6px" color="error" cursor="pointer" />
              <Text color="error" marginTop="6px" cursor="pointer">
                Eliminar
              </Text>
            </Flex>
          ) : null}
          <Flex alignItems="center" cursor="pointer">
            <CloseIcon mr="8px" h="12px" cursor="pointer" onClick={handleOnClick} />
            <Text marginTop="3px" cursor="pointer">{`Agrupado por ${groupOption
              .toString()
              .toUpperCase()}`}</Text>
          </Flex>
        </Flex>
      ) : (
        <Flex>
          <Flex>
            <Checkbox
              pl="6px"
              mr="15px"
              onChange={selectAllRows}
              isChecked={isChecked}
            />
            {Object.keys(selectedRows)?.length > 0 ? (
              <Flex
                alignItems="center"
                justifyContent="center"
                onClick={() => onDelete(selectedRows)}
                cursor="pointer"
              >
                <DeleteIcon mr="6px" color="error" cursor="pointer" />
                <Text color="error" marginTop="6px" cursor="pointer">
                  Eliminar
                </Text>
              </Flex>
            ) : null}
          </Flex>
          {fetchState === fetchType.FILTER ? (
            <Flex
              cursor="pointer"
              alignItems="center"
              ml="24px"
              onClick={handleOnClick}
            >
              <CloseIcon mr="8px" h="12px" />
              <Text marginTop="6px" cursor="pointer">
                Eliminar filtro
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
