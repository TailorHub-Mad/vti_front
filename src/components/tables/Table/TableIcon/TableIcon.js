import { Flex } from "@chakra-ui/react"
import React from "react"
import { HeartIcon } from "../../../icons/HeartIcon"
import { SubscribeIcon } from "../../../icons/SubscribeIcon"

export const TableIcon = ({ isFavorite = false, isSubscribe = false }) => {
  return (
    <Flex alignItems="center" justifyContent="center" gridGap="8px">
      {isSubscribe ? <SubscribeIcon width="16px" height="16px" /> : null}
      {isFavorite ? <HeartIcon width="16px" height="16px" /> : null}
    </Flex>
  )
}
