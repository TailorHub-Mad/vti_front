import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { fetchType } from "../../../utils/constants/swr"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

const notesMenuOptions = {
  all: {
    label: "Todos los mensajes",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  notes: {
    label: "Apuntes",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  containers: {
    label: "Contenedores",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  manteinance: {
    label: "Mantenimiento",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  behaviour: {
    label: "Comportamiento",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  fixed: {
    label: "Fijados",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  }
}

export const NotificationsMenu = ({
  fetchState = fetchType.ALL,
  notesCount = 0,
  onChange
}) => {
  return (
    <>
      <Flex>
        {Object.entries(notesMenuOptions).map(([name, item], idx) => {
          const { icon, activeIcon, label } = item
          const isActive = name === fetchState
          const color = isActive ? "blue.500" : "grey"
          const Icon = isActive ? activeIcon : icon

          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              onClick={() => onChange(name)}
              ml={idx !== 0 ? "16px" : "0"}
            >
              <Icon mr="4px" color={color} />
              <Text variant="d_s_medium" mt="4px" color={color}>
                {label}
              </Text>
            </Flex>
          )
        })}
      </Flex>
      <Text color="#C9C9C9" variant="d_s_medium">
        {`${notesCount} Apuntes`}
      </Text>
    </>
  )
}
