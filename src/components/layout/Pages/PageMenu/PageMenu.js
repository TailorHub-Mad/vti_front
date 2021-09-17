import { Flex } from "@chakra-ui/react"
import React from "react"

export const PageMenu = ({ children, ...props }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      height="24px"
      width="100%"
      mb="8px"
      {...props}
    >
      {children}
    </Flex>
  )
}
