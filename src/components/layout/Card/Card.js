import { Box } from "@chakra-ui/react"
import React from "react"

export const Card = ({ children, ...props }) => {
  return (
    <Box
      boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
      borderRadius="2px"
      width={["343px", null, null, "282px"]}
      padding="16px"
      bgColor="white"
      {...props}
    >
      {children}
    </Box>
  )
}
