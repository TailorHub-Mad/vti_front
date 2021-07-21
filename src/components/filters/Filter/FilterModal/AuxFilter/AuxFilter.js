import { Box, Button, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { FilterModalHeader } from "../FilterModalHeader/FilterModalHeader"

export const AuxFilter = ({onClose, ...props}) => {
  return (
    <Box
      width="460px"
      height="fit-content"
      position="absolute"
      top="50px"
      right="18%"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <FilterModalHeader title="Apuntes" onClose={onClose} />
      <Flex justifyContent="space-between">
        <Text>Fin</Text>
      </Flex>
    </Box>
  )
}
