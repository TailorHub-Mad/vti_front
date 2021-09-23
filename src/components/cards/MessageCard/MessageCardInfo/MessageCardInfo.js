import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { getAcronym } from "../../../../utils/functions/common"

export const MessageCardInfo = ({ id, author, updatedAt, ...props }) => {
  return (
    <Flex {...props} width="100%" justifyContent="space-between">
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
        {getAcronym(author)}
      </Text>
      <Text color="grey" variant="d_xs_regular" marginLeft="10px">
        ult. actualización {updatedAt}
      </Text>
    </Flex>
  )
}
