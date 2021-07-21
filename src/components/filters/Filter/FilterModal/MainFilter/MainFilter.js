import { Box, Button, Flex } from "@chakra-ui/react"
import React from "react"
import { FilterModalHeader } from "../FilterModalHeader/FilterModalHeader"
import { SimpleFilterForm } from "./SimpleFilterForm/SimpleFilterForm"

export const MainFilter = ({
  onClose,
  onSecondaryOpen,
  onSimpleFilterChange,
  simpleFilterValues,
  ...props
}) => {
  return (
    <Box
      width="460px"
      height="fit-content"
      position="absolute"
      top="50px"
      left="calc(50vw - 230px)"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <FilterModalHeader title="Filtrar" onClose={onClose} />
      <SimpleFilterForm
        value={simpleFilterValues}
        onChange={onSimpleFilterChange}
        openAuxModal={onSecondaryOpen}
      />
      <Flex justifyContent="space-between">
        <Button variant="secondary">Recordar</Button>
        <Button>Filtrar</Button>
      </Flex>
    </Box>
  )
}
