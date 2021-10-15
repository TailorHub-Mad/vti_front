import { Box } from "@chakra-ui/react"
import React from "react"

export const CustomModalContent = ({ children, ...props }) => {
  return (
    <Box
      width="100vw"
      height="100vh"
      position="fixed"
      top="0"
      left="0"
      bgColor="#052E5780"
      zIndex="1400"
      {...props}
    >
      {children}
    </Box>
  )
}
