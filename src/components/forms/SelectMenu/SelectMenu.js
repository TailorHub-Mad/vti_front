import { Box, ListItem, UnorderedList } from "@chakra-ui/react"
import React from "react"

export const SelectMenu = ({ onSelect, options = [], ...props }) => {
  return (
    <UnorderedList
      width="100%"
      bgColor="light_grey"
      maxHeight="320px"
      overflowY="scroll"
      borderRadius="2px"
      marginLeft="0"
      position="absolute"
      zIndex="900"
      {...props}
    >
      {options.map((option) => (
        <ListItem
          key={option.value}
          _hover={{ bgColor: "blue", color: "white", cursor: "pointer" }}
          padding="16px 8px"
          onClick={() => onSelect(option.value)}
        >
          {option.label || ""}
        </ListItem>
      ))}
    </UnorderedList>
  )
}
