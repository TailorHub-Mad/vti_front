import { Box, Button, Flex, Input, Switch, Text } from "@chakra-ui/react"
import React from "react"
import { CustomModalHeader } from "../../../overlay/Modal/CustomModalHeader/CustomModalHeader"

export const SaveFilterModal = ({ onClose, ...props }) => {
  return (
    <Box
      width="460px"
      height="fit-content"
      position="fixed"
      top="calc(50vh - 300px)"
      left={"calc(50vw - 230px)"}
      transition="left 0.18s ease-in-out"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <CustomModalHeader title="Guardar filtro" onClose={onClose} pb="24px" />
      <Text variant="d_s_medium" mb="2px">
        Escriba o seleccione una combinación
      </Text>
      <Input placeholder="Filtro 1" mb="24px" />
      <Switch>Quiero que el filtro sea público</Switch>
      <Flex justifyContent="space-between" mt="24px">
        <Button variant="secondary" color="error" borderColor="error">
          Eliminar
        </Button>
        <Button>Guardar</Button>
      </Flex>
    </Box>
  )
}
