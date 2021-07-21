import { Box } from "@chakra-ui/react"
import React from "react"

export const PageBody = ({ children, ...props }) => {
  return (
    <Box overflowY="scroll" height="calc(100vh - 170px)" {...props}>
      {children}
    </Box>
  )
}
