import { Box, Button, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
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
  const [isReset, setIsReset] = useState(false)

  const handleOnReset = () => {
    setIsReset(true)
    onReset()
  }

  return (
    <Box
      width="460px"
      position="absolute"
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
        isReset={isReset}
      />

      <Flex direction="column" align="center">
        <Button onClick={onFilter}>Filtrar</Button>
        <Text
          oonClick={handleOnReset}
          variant="d_xs_regular"
          mt="32px"
          cursor="pointer"
        >
          Resetear filtros
        </Text>
      </Flex>
    </Box>
  )
}
