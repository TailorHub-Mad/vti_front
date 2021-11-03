import { Box } from "@chakra-ui/react"
import React from "react"

export const CustomModalContent = ({ children, ...props }) => {
  return (
    <Box
      width="100vw"
      height="100vh"
      position="absolute"
      top="0"
      left="0"
      bottom="40"
      zIndex="1400"
      overflowY="scroll"
      {...props}
    >
      {children}
    </Box>
  )
}
