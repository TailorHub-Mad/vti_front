import { Flex } from "@chakra-ui/react"
import React from "react"
import { Spinner } from "../../components/spinner/Spinner"

export const LoadingView = ({ ...props }) => {
  return (
    <Flex
      h="100vh"
      justifyContent="center"
      alignItems="center"
      overflowY="hidden"
      {...props}
    >
      <Spinner />
    </Flex>
  )
}

export default React.memo(LoadingView)
