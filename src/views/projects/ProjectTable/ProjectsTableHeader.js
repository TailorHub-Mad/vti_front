import { CloseIcon, DeleteIcon } from "@chakra-ui/icons"
import { chakra, Checkbox, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { fetchType } from "../../../utils/constants/swr"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

const visibility_menu = {
  all: {
    label: "Todos",
    value: fetchType.ALL,
    active_icon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  active: {
    label: "Activos",
    value: fetchType.ACTIVE,
    active_icon: ICONS_REFERENCE.active,
    icon: ICONS_REFERENCE.active
  }
}

export const ProjectsTableHeader = ({
  projectsCount = 0,
  onChange,
  activeItem = fetchType.ALL,
  selectedRows,
  onDelete,
  selectAllRows = () => {},
  checked = false,
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
        <Flex justify="flex-start" alignItems="center">
          <Flex alignItems="center">
            <CloseIcon mr="8px" h="12px" cursor="pointer" onClick={handleOnClick} />
            <Text marginTop="6px">{`Agrupado por ${groupOption
              .toString()
              .toUpperCase()}`}</Text>
          </Flex>
          {Object.keys(selectedRows)?.length > 0 ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              onClick={() => onDelete(selectedRows)}
              cursor="pointer"
              ml="24px"
            >
              <DeleteIcon mr="8px" color="error" />
              <Text color="error" marginTop="6px">
                Eliminar
              </Text>
            </Flex>
          ) : null}
        </Flex>
      ) : (
        <Flex>
          <Flex mr="15px">
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

          {Object.entries(visibility_menu).map(([name, item], idx) => {
            const isActive = name === activeItem
            return (
              <Flex
                key={name}
                height="24px"
                align="center"
                cursor="pointer"
                onClick={() => onChange(item.value)}
                ml={idx !== 0 ? "16px" : "0"}
              >
                {item.icon ? (
                  isActive ? (
                    <item.active_icon mr="4px" color="blue.500" />
                  ) : (
                    <item.icon mr="4px" color="grey" />
                  )
                ) : null}
                <Text
                  variant="d_s_medium"
                  mt="4px"
                  color={isActive ? "blue.500" : "grey"}
                >
                  {item.label}
                </Text>
              </Flex>
            )
          })}
          {fetchState === fetchType.FILTER ? (
            <Flex alignItems="center" ml="24px">
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
