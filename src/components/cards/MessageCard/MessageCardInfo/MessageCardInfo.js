import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const MessageCardInfo = ({ id, author, updatedAt,...props }) => {
  return (
    <Flex {...props}>
      <Text color="grey" variant="d_xs_regular">
        {id}
      </Text>
      <Text
        color="grey"
        isTruncated
        maxWidth="70px"
        variant="d_xs_regular"
        marginLeft="10px"
      >
        {author}
      </Text>
      <Text color="grey" variant="d_xs_regular" marginLeft="10px">
        ult. actualización {updatedAt}
      </Text>
    </Flex>
  )
}
