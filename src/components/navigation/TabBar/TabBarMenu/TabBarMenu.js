import { Box } from "@chakra-ui/react"
import React from "react"
import { MenuItem } from "../TabBarMenuItem/TabBarMenuItem"

export const TabBarMenu = ({ navMenuItems, ...props }) => {
  return (
    <Box
      as="nav"
      overflowY="hidden"
      maxHeight="65vh"
      marginTop={["64px", null, null, "16px"]}
      {...props}
    >
      {navMenuItems.map((item, idx) => (
        <MenuItem
          key={`${item.label}-${idx}`}
          label={item.label}
          href={item.href}
          icon={<item.icon />}
          submenu={item.submenu}
          disabled={item.disabled}
          openMenu={item.openMenu}
        />
      ))}
    </Box>
  )
}
