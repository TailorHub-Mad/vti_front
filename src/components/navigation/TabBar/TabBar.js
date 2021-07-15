import { ChevronRightIcon, CloseIcon, Icon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import {
  TABBAR_ADMIN_LINKS,
  TABBAR_USER_LINKS,
} from "../../../constants/tabbar_links"
import { MenuMobileIcon } from "../../icons/MenuMobileIcon"
import { NotificationActiveLineIcon } from "../../icons/NotificationActiveLineIcon"
import { NotificationLineIcon } from "../../icons/NotificationLineIcon"
import { SignOutLineIcon } from "../../icons/SignOutLineIcon"
import { LogoFull } from "../../images/LogoFull/LogoFull"

const MenuItem = ({ label, icon, submenu, ...props }) => {
  //TODO link, detectar active y submenu
  const [showSubmenu, setShowSubmenu] = useState(false)

  return (
    <Flex
      align="center"
      padding="8px 0"
      {...props}
      marginBottom="16px"
      role="group"
      _hover={{
        cursor: "pointer",
      }}
      pointerEvents={props.isDisabled ? "none" : "auto"}
      opacity={props.isDisabled ? "0.3" : "1"}
    >
      <Icon color="white" marginRight="8px" _groupHover={{ color: "yellow" }}>
        {icon}
      </Icon>
      <Text
        color="white"
        variant="d_s_medium"
        _groupHover={{ color: "yellow" }}
        marginTop="3px"
      >
        {label}
      </Text>
    </Flex>
  )
}

export const TabBar = ({
  isOpen,
  setIsOpen,
  isAdmin = false,
  areActiveNotifications = true,
}) => {
  const onToggle = () => setIsOpen(!isOpen)
  const navMenuItems = isAdmin ? TABBAR_ADMIN_LINKS : TABBAR_USER_LINKS
  return (
    <>
      <Box
        display={["none", null, null, "flex"]}
        flexDir="column"
        justifyContent="center"
        width="24px"
        height="100vh"
        position="fixed"
        top="0"
        left={!isOpen ? "0" : "176px"}
        transition={"left 0.2s ease-in"}
        cursor="pointer"
        onClick={onToggle}
        zIndex="9990"
      >
        <Icon
          transform={`rotateZ(${isOpen ? "180" : "0"}deg)`}
          height="24px"
          color="white"
          bg="blue"
          width="24px"
        >
          <ChevronRightIcon />
        </Icon>
      </Box>
      <Box
        display={["block", null, null, "none"]}
        top={isOpen ? "24px" : "16px"}
        left="16px"
        height="33px"
        width="33px"
        zIndex="9990"
        position="fixed"
        onClick={onToggle}
        cursor="pointer"
      >
        {isOpen ? (
          <CloseIcon width="32px" color="white" />
        ) : (
          <MenuMobileIcon width="33px" color="white" />
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        padding={["20px", null, null, "32px 32px"]}
        position="fixed"
        left={["0", null, null, isOpen ? "0" : "-176px"]}
        top="0"
        width={["100%", null, null, "200px"]}
        bg="blue"
        zIndex="999"
        transition={"all 0.2s ease-in"}
        overflow="hidden"
        height={[isOpen ? "100vh" : "64px", null, null, "100vh"]}
      >
        <LogoFull
          width="110px"
          height="32px"
          color="white"
          position={["fixed", null, null, "relative"]}
          left={["calc(50vw - 60px)", null, null, "auto"]}
          top={["16px", null, null, "0"]}
          marginBottom="16px"
        />
        <Flex direction="column" justify="space-between" height="100vh">
          <Box
            as="nav"
            overflowY="hidden"
            maxHeight="65vh"
            marginTop={["64px", null, null, "16px"]}
          >
            {navMenuItems.map((link) => (
              <MenuItem key="label" label={link.label} icon={<link.icon />} />
            ))}
          </Box>
          <Box as="nav">
            <Box
              as="span"
              bgColor="yellow"
              width="16px"
              height="2px"
              display="block"
              marginBottom={["16px", null, null, "42px"]}
            />
            <MenuItem
              label="Notificaciones"
              icon={
                areActiveNotifications ? (
                  <NotificationActiveLineIcon />
                ) : (
                  <NotificationLineIcon />
                )
              }
            />
            <MenuItem label="Cerrar sesión" icon={<SignOutLineIcon />} />
          </Box>
        </Flex>
      </Box>
    </>
  )
}
