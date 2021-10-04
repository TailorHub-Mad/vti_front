import { Center, Text } from "@chakra-ui/react"
import React from "react"

export const ViewNotFoundState = ({ ...props }) => {
  return (
    <Center flexDir="column" mt="150px" {...props}>
      <Text variant="d_s_medium" mb="24px">
        No se ha encontrado ningún resultado
      </Text>
    </Center>
  )
}
