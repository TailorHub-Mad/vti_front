import { Box } from "@chakra-ui/react"
import React from "react"
import { MenuItem } from "../TabBarMenuItem/TabBarMenuItem"

export const TabBarMenu = ({navMenuItems, ...props}) => {
  return (
    <Box
      as="nav"
      overflowY="hidden"
      maxHeight="65vh"
      marginTop={["64px", null, null, "16px"]}
      {...props}
    >
      {navMenuItems.map((link) => (
        <MenuItem key="label" label={link.label} href={link.href} icon={<link.icon />} />
      ))}
    </Box>
  )
}
