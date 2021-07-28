import { Box } from "@chakra-ui/react"
import React, { useState } from "react"
import { TabBar } from "../../navigation/TabBar/TabBar"
import Meta from "../Meta/Meta"
import { PageHeader } from "../PageHeader/PageHeader"

export const Page = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <Meta />
      <TabBar isOpen={isOpen} setIsOpen={(val) => setIsOpen(val)} />
      <Box
        transition={"padding-left 0.15s ease-in-out"}
        pl={["20px", null, null, isOpen ? "224px" : "48px"]}
        pt={["88px", null, null, "32px"]}
        pr={["20px", null, null, "24px"]}
        pb="0"
        overflow={"hidden"}
        background={"url(/images/backgrounds/general_bg.svg)"}
        bgRepeat="no-repeat"
        bgAttachment="fixed"
        bgSize="stretch"
        bgPosition="0 -100px"
      >
        {children}
      </Box>
    </>
  )
}
