import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { PATHS } from "../../../../utils/constants/global"
import { NotificationActiveLineIcon } from "../../../icons/NotificationActiveLineIcon"
import { NotificationLineIcon } from "../../../icons/NotificationLineIcon"
import { SignOutLineIcon } from "../../../icons/SignOutLineIcon"
import { Popup } from "../../../overlay/Popup/Popup"
import { MenuItem } from "../TabBarMenuItem/TabBarMenuItem"

export const TabBarFooter = ({ areActiveNotifications }) => {
  const { logout } = useContext(ApiAuthContext)

  const [isOpen, setIsOpen] = useState(false)

  return (
    <Box as="nav">
      <Popup
        variant="twoButtons"
        confirmText="Cerrar"
        cancelText="Cancelar"
        color="error"
        isOpen={isOpen}
        onConfirm={() => logout()}
        onClose={() => setIsOpen(false)}
      >
        ¿Deseas cerrar la sesión?
      </Popup>
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
        disabled={false}
        icon={
          areActiveNotifications ? (
            <NotificationActiveLineIcon />
          ) : (
            <NotificationLineIcon />
          )
        }
      />
      <Flex marginBottom="42px" cursor="pointer" onClick={() => setIsOpen(true)}>
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
