import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { ICONS_REFERENCE } from "../../../utils/constants/icons_reference"

export const NotesMenu = ({
  notesCount = 0,
  onChange,
  activeItem = "favs",
  ...props
}) => {

  const visibility_menu = {
    all: {
      label: "Todos",
      active_icon: ICONS_REFERENCE.notes,
      icon: ICONS_REFERENCE.notes,
    },
    favs: {
      label: "Favoritos",
      active_icon: ICONS_REFERENCE.heart,
      icon: ICONS_REFERENCE.heart_line,
    },
    suscribed: {
      label: "Suscritos",
      active_icon: ICONS_REFERENCE.subscribe,
      icon: ICONS_REFERENCE.subscribe_line,
    },
    unread: {
      label: "No leídos",
      active_icon: ICONS_REFERENCE.hide,
      icon: ICONS_REFERENCE.hide_line,
    },
    active: {
      label: "Activos",
      active_icon: ICONS_REFERENCE.active,
      icon: ICONS_REFERENCE.active,
    },
  }

  return (
    <>
      <Flex {...props}>
        {Object.entries(visibility_menu).map(([name, item], idx) => {
          const isActive = name === activeItem
          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              onClick={() => onChange(name)}
              ml={idx !== 0 ? "16px" : "0"}
            >
              {isActive ? (
                <item.active_icon mr="4px" color="blue.500" />
              ) : (
                <item.icon mr="4px" color="grey" />
              )}
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
      <Text color="#C9C9C9" variant="d_s_medium">
        {`${notesCount} Notas`}
      </Text>
    </>
  )
}
