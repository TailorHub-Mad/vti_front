import { Box } from "@chakra-ui/react"
import React from "react"

export const CustomModalContent = ({ children, ...props }) => {
  return (
    <Box
      width="100vw"
      height={["none", null, null, "100vh"]}
      position="absolute"
      top="0"
      left="0"
      bottom={["0", null, null, "40"]}
      zIndex="1400"
      overflowY="scroll"
      {...props}
    >
      {children}
    </Box>
  )
}
