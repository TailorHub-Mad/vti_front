import { CloseIcon, DeleteIcon } from "@chakra-ui/icons"
import { chakra, Checkbox, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { RoleType } from "../../../utils/constants/global"
import { fetchType } from "../../../utils/constants/swr"

export const ProjectsTableHeader = ({
  projectsCount = 0,
  selectedRows = {},
  onDelete,
  selectAllRows = () => {},
  checked = false,
  fetchState,
  onGroup,
  onFilter,
  groupOption,
  role
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
        <Flex justify="flex-start" alignItems="center">
          <Flex alignItems="center">
            <CloseIcon mr="8px" h="12px" cursor="pointer" onClick={handleOnClick} />
            <Text marginTop="6px">{`Agrupado por ${groupOption
              .toString()
              .toUpperCase()}`}</Text>
          </Flex>
          {Object.keys(selectedRows)?.length > 0 ? (
            role === RoleType.ADMIN ? (
              <Flex
                alignItems="center"
                justifyContent="center"
                onClick={() => onDelete(selectedRows)}
                cursor="pointer"
                ml="24px"
              >
                <DeleteIcon mr="6px" color="error" />
                <Text color="error" marginTop="6px">
                  Eliminar
                </Text>
              </Flex>
            ) : null
          ) : null}
        </Flex>
      ) : (
        <Flex>
          {role === RoleType.ADMIN ? (
            <Flex mr="15px" minH="22px" alignItems="center">
              <Checkbox pl="6px" onChange={selectAllRows} isChecked={isChecked} />
              {Object.keys(selectedRows)?.length > 0 ? (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  onClick={() => onDelete(selectedRows)}
                  cursor="pointer"
                  ml="16px"
                >
                  <DeleteIcon mr="6px" color="error" />
                  <Text color="error" marginTop="6px">
                    Eliminar
                  </Text>
                </Flex>
              ) : null}
            </Flex>
          ) : null}

          {fetchState === fetchType.FILTER ? (
            <Flex alignItems="center" ml="16px">
              <CloseIcon
                mr="8px"
                h="12px"
                cursor="pointer"
                onClick={handleOnClick}
              />
              <Text marginTop="6px">{`Eliminar filtro`}</Text>
            </Flex>
          ) : null}
        </Flex>
      )}

      <Flex align="center">
        <Text variant="d_xs_regular" color="green" mr="15px">
          <chakra.span
            w="6px"
            h="6px"
            bgColor="green"
            display="inline-block"
            borderRadius="3px"
            mr="5px"
            mb="1px"
          />
          Proyectos Finalizados
        </Text>
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${projectsCount} Proyectos`}
        </Text>
      </Flex>
    </Flex>
  )
}
