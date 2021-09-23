import { DeleteIcon } from "@chakra-ui/icons"
import { chakra, Checkbox, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { fetchType } from "../../../utils/constants/global_config"
import { ICONS_REFERENCE } from "../../../utils/constants/icons_reference"

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
  checked = false
}) => {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  return (
    <Flex justify="space-between" align="center" pb="32px">
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
      </Flex>
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
