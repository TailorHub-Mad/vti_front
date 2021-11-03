import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { CloseIcon } from "../../../icons/CloseIcon"

export const CustomModalHeader = ({ onClose, title, ...props }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      height="33px"
      {...props}
      mt={["32px", null, null, "0"]}
      mb={["24px", null, null, "0"]}
    >
      <Text variant="d_l_medium">{title}</Text>
      {onClose && <CloseIcon cursor="pointer" onClick={onClose} />}
    </Flex>
  )
}
