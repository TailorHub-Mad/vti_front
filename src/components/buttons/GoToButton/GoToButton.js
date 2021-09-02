import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { NextIcon } from "../../icons/NextIcon"

export const GoToButton = ({ label, children, ...props }) => {
  return (
    <Flex align="center" cursor="pointer" {...props}>
      <Text variant="d_xs_regular" color="grey" mr="4px">
        {label || children}
      </Text>
      <NextIcon color="grey" width="16px" />
    </Flex>
  )
}
