import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { fetchType } from "../../../utils/constants/swr"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

const notesMenuOptions = {
  all: {
    label: "Todos",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  favs: {
    label: "Favoritos",
    activeIcon: ICONS_REFERENCE.heart,
    icon: ICONS_REFERENCE.heart_line
  },
  suscribed: {
    label: "Suscritos",
    activeIcon: ICONS_REFERENCE.subscribe,
    icon: ICONS_REFERENCE.subscribe_line
  },
  unread: {
    label: "No leídos",
    activeIcon: ICONS_REFERENCE.hide,
    icon: ICONS_REFERENCE.hide_line
  },
  active: {
    label: "Activos",
    activeIcon: ICONS_REFERENCE.active,
    icon: ICONS_REFERENCE.active
  }
}

export const NotesMenu = ({
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
