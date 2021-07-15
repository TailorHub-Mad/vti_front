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
        transition={"padding-left 0.2s ease-in"}
        padding={["20px", null, null, "32px"]}
        paddingLeft={["20px", null, null, isOpen ? "224px" : "48px"]}
        paddingTop={["88px", null, null, "32px"]}
        overflowX={"hidden"}
      >
        {children}
      </Box>
    </>
  )
}
