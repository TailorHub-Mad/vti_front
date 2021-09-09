import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const PageHeader = ({ title, children, ...props }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      height="56px"
      marginBottom="16px"
      {...props}
    >
      {title ? (
        <>
          <Text variant="d_l_medium">{title}</Text>
          <Flex width="fit-content">{children}</Flex>
        </>
      ) : (
        children
      )}
    </Flex>
  )
}
