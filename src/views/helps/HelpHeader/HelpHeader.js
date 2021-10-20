import { Flex, Text, Box } from "@chakra-ui/react"
import React from "react"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

const HELP_MENU = {
  projects_board: {
    label: "Tablero Tag Proyecto",
    active_icon: ICONS_REFERENCE.departments,
    icon: ICONS_REFERENCE.departments
  },
  projects_alphabetic: {
    label: "Alfabético Tag Proyecto",
    active_icon: ICONS_REFERENCE.list,
    icon: ICONS_REFERENCE.list
  },
  notes_board: {
    label: "Tablero Tag Apunte",
    active_icon: ICONS_REFERENCE.departments,
    icon: ICONS_REFERENCE.departments
  },
  notes_alphabetic: {
    label: "Alfabético Tag Apunte",
    active_icon: ICONS_REFERENCE.list,
    icon: ICONS_REFERENCE.list
  }
}

export const HelpHeader = ({
  tagsCount = 0,
  onChange,
  activeItem = "projects_board"
}) => {
  return (
    <Flex justify="space-between" align="center" pb="32px">
      <Flex>
        {Object.entries(HELP_MENU).map(([name, item], idx) => {
          const isActive = name === activeItem
          return (
            <Flex
              key={name}
              height="24px"
              align="center"
              cursor="pointer"
              role="group"
              onClick={() => onChange && onChange(name)}
              ml={idx !== 0 ? "16px" : "0"}
            >
              {item.icon ? (
                isActive ? (
                  <item.active_icon mr="4px" color="blue.500" />
                ) : (
                  <item.icon
                    mr="4px"
                    color="grey"
                    _groupHover={{ color: "blue.500" }}
                  />
                )
              ) : null}
              <Text
                variant="d_s_medium"
                mt="4px"
                color={isActive ? "blue.500" : "grey"}
                _groupHover={{ color: "blue.500" }}
              >
                {item.label}
              </Text>
              {idx === 1 ? (
                <Box
                  width="2px"
                  height="16px"
                  bgColor="yellow"
                  display="block"
                  margin="4px 0px 4px 20px"
                />
              ) : null}
            </Flex>
          )
        })}
      </Flex>
      <Flex align="center">
        <Text color="#C9C9C9" variant="d_s_medium">
          {`${tagsCount} Tags`}
        </Text>
      </Flex>
    </Flex>
  )
}
