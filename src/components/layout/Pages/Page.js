import { Box, Text, useMediaQuery } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { ToastContext } from "../../../provider/ToastProvider"
import { TabBar } from "../../navigation/TabBar/TabBar"
import { Popup } from "../../overlay/Popup/Popup"

export const Page = ({ children, newNote, ...props }) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  const [isOpen, setIsOpen] = useState(isScreen)
  const { isToastOpen, message, secondaryMessage, toastType } =
    useContext(ToastContext)

  return (
    <>
      <TabBar isOpen={isOpen} setIsOpen={(val) => setIsOpen(val)} />
      <Popup isOpen={isToastOpen} variant="info" type={toastType}>
        <Text textAlign="center" color={"blue.500"} variant="d_m_regular" mb="4px">
          {message}
        </Text>
        {secondaryMessage && <Text variant="d_xs_regular">{secondaryMessage}</Text>}
      </Popup>
      <Box
        transition={"padding-left 0.15s ease-in-out"}
        pl={[newNote ? "0" : "15px", null, null, isOpen ? "239px" : "63px"]}
        pt={[newNote ? "64px" : "88px", null, null, "32px"]}
        pr={["0", null, null, "24px"]}
        overflow={"hidden"}
        background={"url(/images/backgrounds/general_bg.svg)"}
        bgRepeat="no-repeat"
        bgAttachment="fixed"
        bgSize="cover"
        bgPosition="center"
        minH="100vh"
        pb={newNote ? "0" : "50px"}
        {...props}
      >
        {children}
      </Box>
    </>
  )
}
