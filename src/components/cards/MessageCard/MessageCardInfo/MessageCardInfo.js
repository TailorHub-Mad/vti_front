import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const MessageCardInfo = ({ id, author, updatedAt, isAdmin, ...props }) => {
  return (
    <Flex {...props} width="100%" justifyContent="space-between">
      {isAdmin ? (
        <Text color="grey" variant="d_xs_regular">
          {id}
        </Text>
      ) : null}

      <Text color="grey" isTruncated maxWidth="70px" variant="d_xs_regular">
        {author}
      </Text>
      <Text color="grey" variant="d_xs_regular" marginLeft="10px">
        ult. actualización {updatedAt}
      </Text>
    </Flex>
  )
}
