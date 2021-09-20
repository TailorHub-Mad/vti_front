import { Flex } from "@chakra-ui/react"
import React from "react"

export const OptionsMenuItem = ({ isLast, children, ...props }) => {
  return (
    <Flex
      align="center"
      width="100%"
      height="32px"
      borderColor="blue.500"
      borderBottom={isLast ? "none" : "1px solid"}
      cursor="pointer"
      padding="8px"
      _hover={{
        opacity: "0.8"
      }}
      {...props}
    >
      {children}
    </Flex>
  )
}
