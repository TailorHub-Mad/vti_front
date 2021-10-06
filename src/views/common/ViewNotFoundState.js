import { Center, Text } from "@chakra-ui/react"
import React from "react"

export const ViewNotFoundState = ({ text, ...props }) => {
  return (
    <Center flexDir="column" mt="150px" {...props}>
      <Text variant="d_s_medium" mb="24px">
        {text || "No se ha encontrado ningún resultado"}
      </Text>
    </Center>
  )
}
