import { Flex, Text, useMediaQuery } from "@chakra-ui/react"
import React from "react"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

const notesMenuOptions = {
  all: {
    label: "Todos",
    activeIcon: ICONS_REFERENCE.notes,
    icon: ICONS_REFERENCE.notes
  },
  favorites: {
    label: "Favoritos",
    activeIcon: ICONS_REFERENCE.heart,
    icon: ICONS_REFERENCE.heart_line,
    query: `favorites=true`
  },
  subscribed: {
    label: "Suscritos",
    activeIcon: ICONS_REFERENCE.subscribe,
    icon: ICONS_REFERENCE.subscribe_line,
    query: `subscribed=true`
  },
  noRead: {
    label: "No leídos",
    activeIcon: ICONS_REFERENCE.hide,
    icon: ICONS_REFERENCE.hide_line,
    query: `noRead=true`
  }
}

export const NotesMenu = ({ notesCount = 0, onChange, fetchDirectFilter }) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  return (
    <>
      <Flex gridGap="16px">
        {Object.entries(notesMenuOptions).map(([name, item]) => {
          const { icon, activeIcon, label } = item
          const isActive = name === fetchDirectFilter
          const color = isActive ? "blue.500" : "grey"
          const Icon = isActive ? activeIcon : icon

          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              role="group"
              onClick={() => onChange(name)}
            >
              <Icon mr="4px" color={color} _groupHover={{ color: "blue.500" }} />
              {isScreen || isActive ? (
                <Text
                  variant="d_s_medium"
                  mt="4px"
                  color={color}
                  _groupHover={{ color: "blue.500" }}
                >
                  {label}
                </Text>
              ) : null}
            </Flex>
          )
        })}
      </Flex>
      <Text color="#C9C9C9" variant="d_s_medium" pr={["18px", null, null, null]}>
        {`${notesCount} Apuntes`}
      </Text>
    </>
  )
}
