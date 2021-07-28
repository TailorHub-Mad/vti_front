import { Box } from '@chakra-ui/react'
import React from 'react'
import { NotificationActiveLineIcon } from '../../icons/NotificationActiveLineIcon'
import { NotificationLineIcon } from '../../icons/NotificationLineIcon'
import { SignOutLineIcon } from '../../icons/SignOutLineIcon'
import { MenuItem } from '../TabBarMenuItem/TabBarMenuItem'

export const TabBarFooter = ({areActiveNotifications}) => {
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
          link="/notificaciones"
          icon={
            areActiveNotifications ? (
              <NotificationActiveLineIcon />
            ) : (
              <NotificationLineIcon />
            )
          }
        />
        <MenuItem label="Cerrar sesión" link="/signout" icon={<SignOutLineIcon />} />
      </Box>
    )
}
