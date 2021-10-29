import { Box, Flex } from "@chakra-ui/react"
import React, { useContext } from "react"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global"
import {
  TABBAR_ADMIN_LINKS,
  TABBAR_USER_LINKS
} from "../../../utils/constants/tabbar"
import { LogoFull } from "../../images/LogoFull"
import { TabBarFooter } from "./TabBarFooter/TabBarFooter"
import { TabBarMenu } from "./TabBarMenu/TabBarMenu"
import { TabBarToggle } from "./TabBarToggle/TabBarToggle"

export const TabBar = ({ isOpen, setIsOpen }) => {
  const { role } = useContext(ApiAuthContext)
  const onToggle = () => setIsOpen(!isOpen)
  const navMenuItems =
    role === RoleType.ADMIN ? TABBAR_ADMIN_LINKS : TABBAR_USER_LINKS
  return (
    <>
      <TabBarToggle onToggle={onToggle} isOpen={isOpen} />
      <Box
        display="flex"
        flexDirection="column"
        position="fixed"
        top="0"
        left={["0", null, null, isOpen ? "0" : "-191px"]}
        width={["100%", null, null, "215px"]}
        height={[isOpen ? "100vh" : "64px", null, null, "100vh"]}
        padding={["20px", null, null, "32px 32px"]}
        bg="blue.500"
        transition={"all 0.15s ease-in-out"}
        zIndex="990"
        overflow="hidden"
      >
        <LogoFull
          width="110px"
          height="32px"
          position={["fixed", null, null, "relative"]}
          top={["16px", null, null, "0"]}
          left={["calc(50vw - 60px)", null, null, "auto"]}
          color="white"
          marginBottom="16px"
        />
        <Flex direction="column" justify="space-between" height="100vh">
          <TabBarMenu navMenuItems={navMenuItems} />
          <TabBarFooter />
        </Flex>
      </Box>
    </>
  )
}
