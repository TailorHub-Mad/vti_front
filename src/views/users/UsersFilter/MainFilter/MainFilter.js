import { Box, Button, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"

import { SimpleFilterForm } from "./SimpleFilterForm/SimpleFilterForm"

export const MainFilter = ({
  onClose,
  onSecondaryOpen,
  onSimpleFilterChange,
  onFilter,
  simpleFilterValues,
  moveToLeft,
  onReset,
  ...props
}) => {
  return (
    <Box
      width="460px"
      height="fit-content"
      position="absolute"
      top="50px"
      left={moveToLeft ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
      transition="left 0.18s ease-in-out"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <CustomModalHeader title="Filtrar" onClose={onClose} pb="24px" />
      <SimpleFilterForm
        value={simpleFilterValues}
        onChange={onSimpleFilterChange}
        openAuxModal={onSecondaryOpen}
      />

      <Flex direction="column" align="center">
        <Button onClick={onFilter}>Filtrar</Button>
        <Text onClick={onReset} variant="d_xs_regular" mt="32px" cursor="pointer">
          Resetear filtros
        </Text>
      </Flex>
    </Box>
  )
}
