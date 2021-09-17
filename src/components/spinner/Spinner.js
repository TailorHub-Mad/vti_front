import { Center, Spinner as ChakraSpinner } from "@chakra-ui/react"
import React from "react"

export const Spinner = ({ ...props }) => {
  return (
    <Center {...props}>
      <ChakraSpinner size="xl" color="blue.500" />
    </Center>
  )
}
