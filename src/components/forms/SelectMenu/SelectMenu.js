import { ListItem, UnorderedList } from "@chakra-ui/react"
import React from "react"
import { CUSTOM_SCROLLBAR } from "../../../theme/utils/utils.theme"

export const SelectMenu = ({ onSelect, options = [], ...props }) => {
  return (
    <UnorderedList
      width="100%"
      bgColor="light_grey"
      maxHeight="300px"
      overflowY="scroll"
      borderRadius="2px"
      marginLeft="0"
      position="absolute"
      zIndex="900"
      boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
      sx={CUSTOM_SCROLLBAR}
      {...props}
    >
      {options?.map((option, idx) => (
        <ListItem
          key={`${option?.value}-${idx}`}
          _hover={{ bgColor: "blue.500", color: "white", cursor: "pointer" }}
          padding="16px 8px"
          onClick={() => onSelect(option?.value)}
        >
          {option?.label || ""}
        </ListItem>
      ))}
    </UnorderedList>
  )
}
