import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const MessageCardInfo = ({ id, author, updatedAt, ...props }) => {
  return (
    <Flex {...props} width="100%" justifyContent="space-between">
        <Text color="grey" variant="d_xs_regular">
          {id}
        </Text>

      <Text
        color="grey"
        isTruncated
        variant="d_xs_regular"
        // marginLeft={isAdmin && id ? "10px" : "0"}
        marginLeft={"0"}
      >
        {author}
      </Text>
      <Text color="grey" variant="d_xs_regular" marginLeft="10px">
        ult. actualización {updatedAt}
      </Text>
    </Flex>
  )
}
