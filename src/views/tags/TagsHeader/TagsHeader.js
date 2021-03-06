import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { ICONS_REFERENCE } from "../../../utils/constants/icons"

export const TagsHeader = ({
  tagsCount = 0,
  onChange,
  activeItem = "inheritance"
}) => {
  const visibility_menu = {
    inheritance: {
      label: "Herencia",
      active_icon: ICONS_REFERENCE.tag_link,
      icon: ICONS_REFERENCE.tag_link
    },
    alphabetic: {
      label: "Alfabético",
      active_icon: ICONS_REFERENCE.list,
      icon: ICONS_REFERENCE.list
    }
  }

  return (
    <Flex justify="space-between" align="center" pb="32px">
      <Flex>
        {Object.entries(visibility_menu).map(([name, item], idx) => {
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
