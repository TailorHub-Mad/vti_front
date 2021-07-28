import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const ActionLink = ({
  label,
  color = "blue.500",
  icon,
  isDisabled,
  ...props
}) => {
  return (
    <Flex
      ml="16px"
      align="center"
      cursor="pointer"
      opacity={isDisabled ? 0.6 : 1}
      pointerEvents={isDisabled ? "none" : "auto"}
      {...props}
    >
      {icon
        ? React.cloneElement(icon, { color: color, width: "16px", mr: "4px" })
        : null}
      <Text variant="d_xs_regular" color={color}>
        {label}
      </Text>
    </Flex>
  )
}
