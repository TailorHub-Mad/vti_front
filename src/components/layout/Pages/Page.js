import { Box } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { ToastContext } from "../../../provider/ToastProvider"
import { TabBar } from "../../navigation/TabBar/TabBar"
import { Popup } from "../../overlay/Popup/Popup"

export const Page = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { isToastOpen, message, toastType } = useContext(ToastContext)

  return (
    <>
      <TabBar isOpen={isOpen} setIsOpen={(val) => setIsOpen(val)} />
      <Popup isOpen={isToastOpen} variant="info" type={toastType}>
        {message}
      </Popup>
      <Box
        transition={"padding-left 0.15s ease-in-out"}
        pl={["30px", null, null, isOpen ? "239px" : "63px"]}
        pt={["88px", null, null, "32px"]}
        pr={["20px", null, null, "24px"]}
        pb="0"
        overflow={"hidden"}
        background={"url(/images/backgrounds/general_bg.svg)"}
        bgRepeat="no-repeat"
        bgAttachment="fixed"
        bgSize="cover"
        bgPosition="center"
        h="100vh"
        {...props}
      >
        {children}
      </Box>
    </>
  )
}
