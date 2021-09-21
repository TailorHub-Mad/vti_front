import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import React, { useContext } from "react"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { PATHS } from "../../../../utils/constants/paths"
import { NotificationActiveLineIcon } from "../../../icons/NotificationActiveLineIcon"
import { NotificationLineIcon } from "../../../icons/NotificationLineIcon"
import { SignOutLineIcon } from "../../../icons/SignOutLineIcon"
import { MenuItem } from "../TabBarMenuItem/TabBarMenuItem"

export const TabBarFooter = ({ areActiveNotifications }) => {
  const { logout } = useContext(ApiAuthContext)

  return (
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
        href={PATHS.notifications}
        disabled={true} // TODO -> provisional
        icon={
          areActiveNotifications ? (
            <NotificationActiveLineIcon />
          ) : (
            <NotificationLineIcon />
          )
        }
      />
      <Flex marginBottom="42px" cursor="pointer" onClick={() => logout()}>
        <Icon color="white" marginRight="8px" _groupHover={{ color: "yellow" }}>
          <SignOutLineIcon />
        </Icon>
        <Text
          color="white"
          variant="d_s_medium"
          _groupHover={{ color: "yellow" }}
          marginTop="3px"
        >
          Cerrar sesión
        </Text>
      </Flex>
    </Box>
  )
}
