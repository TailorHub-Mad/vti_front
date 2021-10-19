import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const SubscriptionCardInfo = ({ client, updatedAt, ...props }) => {
  return (
    <Flex {...props} width="100%" justifyContent="space-between">
      <Text color="grey" isTruncated maxWidth="70px" variant="d_xs_regular">
        {client}
      </Text>
      <Text color="grey" variant="d_xs_regular" marginLeft="10px">
        ult. actualización {updatedAt}
      </Text>
    </Flex>
  )
}
