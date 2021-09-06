import { Box } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { ApiToastContext } from "../../../provider/ApiToastProvider"
import { TabBar } from "../../navigation/TabBar/TabBar"
import { Popup } from "../../overlay/Popup/Popup"
import Meta from "../Meta/Meta"

export const Page = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { isToastOpen, message } = useContext(ApiToastContext)

  return (
    <>
      <Meta />
      <TabBar isOpen={isOpen} setIsOpen={(val) => setIsOpen(val)} />
      <Popup isOpen={isToastOpen} variant="info">
        {message}
      </Popup>
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
        minH="100vh"
      >
        {children}
      </Box>
    </>
  )
}
