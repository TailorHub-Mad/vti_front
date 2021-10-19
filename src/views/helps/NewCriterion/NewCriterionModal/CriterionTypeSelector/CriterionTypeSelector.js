import React from "react"
import { Flex, Box, Text } from "@chakra-ui/react"

export const CriterionTypeSelector = ({ setIsProject, isProject }) => {
  return (
    <Flex
      w="202px"
      h="48px"
      border="1px solid grey"
      p="8px"
      borderRadius="2px"
      mb="32px"
    >
      <Box
        p="8px 16px"
        borderRadius="2px"
        cursor="pointer"
        bgColor={isProject ? "blue.500" : "white"}
        onClick={() => setIsProject(true)}
      >
        <Text variant="d_m_medium" color={isProject ? "white" : "blue.500"}>
          Proyecto
        </Text>
      </Box>
      <Box
        p="8px 16px"
        borderRadius="2px"
        cursor="pointer"
        bgColor={!isProject ? "blue.500" : "white"}
        onClick={() => setIsProject(false)}
      >
        <Text variant="d_m_medium" color={!isProject ? "white" : "blue.500"}>
          Apunte
        </Text>
      </Box>
    </Flex>
  )
}
