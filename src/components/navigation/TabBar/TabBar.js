import { AddIcon, ChevronRightIcon, Icon } from "@chakra-ui/icons"
import { Box, Button, Collapse, Flex, Text } from "@chakra-ui/react"
import { css } from "@emotion/react"
import React, { useState } from "react"
import { MachineLineIcon } from "../../icons/MachineLineIcon"
import { NotificationActiveIcon } from "../../icons/NotificationActiveIcon"
import { SignOutLineIcon } from "../../icons/SignOutLineIcon"
import { TagLineIcon } from "../../icons/TagLineIcon"
import { LogoFull } from "../../images/LogoFull/LogoFull"

const MenuItem = ({ label, icon, ...props }) => {
  return (
    <Flex
      align="center"
      padding="8px 0"
      {...props}
      marginBottom="16px"
      _hover={{
        color: "yellow",
        cursor: "pointer",
      }}
    >
      <Icon color="white" marginRight="8px">
        {icon}
      </Icon>
      <Text color="white" variant="d_s_medium" marginTop="3px">
        {label}
      </Text>
    </Flex>
  )
}
export const TabBar = ({
  isOpen,
  setIsOpen,
  isAdmin = true,
  areActiveNotifications = true,
}) => {
  const onToggle = () => setIsOpen(!isOpen)

  return (
    <>
      <Box
        display="flex"
        flexDir="column"
        justifyContent="center"
        position="fixed"
        left={!isOpen ? "0" : "176px"}
        transition={"left 0.2s ease-in"}
        cursor="pointer"
        top="0"
        onClick={onToggle}
        width="24px"
        height="100vh"
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
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        padding={["20px", null, null, "32px 32px"]}
        position="fixed"
        left={isOpen ? "0" : "-176px"}
        top="0"
        width={["100%", null, null, "200px"]}
        bg="blue"
        zIndex="999"
        transition={"left 0.2s ease-in"}
      >
        <LogoFull width={["110px", null, null, "110px"]} color="white" />
        <Flex direction="column" justify="space-between" height="80vh">
          <Box as="nav" overflowY="hidden" maxHeight="65vh">
            <MenuItem label="Nuevo apunte" icon={<AddIcon />} />
            <MenuItem label="Apuntes" icon={<AddIcon />} />
            <MenuItem label="Proyectos" icon={<AddIcon />} />
            <MenuItem label="Sistemas ensayo" icon={<MachineLineIcon />} />
            <MenuItem label="Tags" icon={<TagLineIcon />} />
            {isAdmin ? (
              <>
                <MenuItem label="Clientes" icon={<AddIcon />} />
                <MenuItem label="Usuarios" icon={<AddIcon />} />
                <MenuItem label="Apoyo" icon={<AddIcon />} />
              </>
            ) : null}
            <MenuItem label="Subscripción" icon={<AddIcon />} />
          </Box>
          <Box as="nav">
            <MenuItem
              label="Notificaciones"
              icon={
                areActiveNotifications ? (
                  <NotificationActiveIcon />
                ) : (
                  <NotificationActiveIcon />
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
