import { Center, Spinner } from "@chakra-ui/react"
import React from "react"

export const LoadingTableSpinner = ({ ...props }) => {
  return (
    <Center marginTop="150px" {...props}>
      <Spinner size="xl" color="blue.500" />
    </Center>
  )
}
