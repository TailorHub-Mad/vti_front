import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const TableCardInfo = ({ client, sector, updatedAt, ...props }) => {
  return (
    <Flex {...props} width="100%" gridGap="16px">
      <Text color="grey" variant="d_xs_regular">
        {client}
      </Text>

      <Text color="grey" isTruncated variant="d_xs_regular">
        {sector}
      </Text>
      <Text color="grey" variant="d_xs_regular" marginLeft="10px">
        ult. actualización {updatedAt}
      </Text>
    </Flex>
  )
}
