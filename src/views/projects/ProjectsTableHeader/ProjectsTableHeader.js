import { chakra, Checkbox, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { ICONS_REFERENCE } from "../../../utils/constants/icons_reference"

export const ProjectsTableHeader = ({
  projectsCount = 0,
  onChange,
  activeItem = "all",
}) => {
  const visibility_menu = {
    all: {
      label: "Todos",
      active_icon: ICONS_REFERENCE.notes,
      icon: ICONS_REFERENCE.notes,
    },
    active: {
      label: "Activos",
      active_icon: ICONS_REFERENCE.active,
      icon: ICONS_REFERENCE.active,
    },
  }

  return (
    <Flex justify="space-between" align="center" pb="32px">
      <Flex>
        <Checkbox mr="8px" />
        {Object.entries(visibility_menu).map(([name, item], idx) => {
          const isActive = name === activeItem
          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              onClick={() => onChange && onChange(name)}
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
        <Text variant="d_xs_regular" color="green" mr="8px">
          <chakra.span
            w="6px"
            h="6px"
            bgColor="green"
            display="inline-block"
            borderRadius="3px"
            mr="9px"
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
