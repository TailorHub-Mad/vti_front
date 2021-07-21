import { Box } from "@chakra-ui/react"
import React from "react"

export const FilterModalContent = ({ children, ...props }) => {
  return (
    <Box
      width="100vw"
      height="100vh"
      position="fixed"
      top="0"
      left="0"
      bgColor="transparent"
      zIndex="1400"
      overflow="scroll"
      {...props}
    >
      {children}
    </Box>
  )
}
