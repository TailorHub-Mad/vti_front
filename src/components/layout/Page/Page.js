import { Box } from "@chakra-ui/react"
import React, { useState } from "react"
import { TabBar } from "../../navigation/TabBar/TabBar"
import Meta from "../Meta/Meta"

export const Page = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Meta />
      <TabBar isOpen={isOpen} setIsOpen={(val) => setIsOpen(val)} />
      <Box
        marginLeft={isOpen ? "200" : "24px"}
        transition={"margin-left 0.2s ease-in"}
        padding="32px"
      >
        {children}
      </Box>
    </>
  )
}
