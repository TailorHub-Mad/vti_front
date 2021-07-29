import { Box } from "@chakra-ui/react"
import React from "react"
import { CUSTOM_SCROLLBAR } from "../../../theme/utils/utils.theme"

export const PageBody = ({ children, ...props }) => {
  return (
    <Box
      overflowY="scroll"
      height="calc(100vh - 100px)"
      pt="16px"
      sx={CUSTOM_SCROLLBAR}
      {...props}
    >
      {children}
    </Box>
  )
}