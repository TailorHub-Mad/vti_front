import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { fetchType } from "../../../utils/constants/swr"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

const projectsMenuOptions = {
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

export const ProjectsMenu = ({ fetchState = fetchType.ALL, onChange }) => {
  return (
    <>
      <Flex mb="16px" ml="34px">
        {Object.entries(projectsMenuOptions).map(([name, item], idx) => {
          const isActive = name === fetchState

          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              role="group"
              onClick={() => onChange(item.value)}
              ml={idx !== 0 ? "16px" : "0"}
            >
              {item.icon ? (
                isActive ? (
                  <item.active_icon color="blue.500" />
                ) : (
                  <item.icon color="grey" _groupHover={{ color: "blue.500" }} />
                )
              ) : null}
              <Text
                variant="d_s_medium"
                _groupHover={{ color: "blue.500" }}
                mt="4px"
                color={isActive ? "blue.500" : "grey"}
              >
                {item.label}
              </Text>
            </Flex>
          )
        })}
      </Flex>
    </>
  )
}
