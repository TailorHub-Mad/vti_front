import { Flex, Text } from "@chakra-ui/react"
import React from "react"
import { CloseIcon } from "../../../icons/CloseIcon"

export const CustomModalHeader = ({ onClose, title, ...props }) => {
  return (
    <Flex justify="space-between" align="center" height="33px" {...props}>
      <Text variant="d_l_medium">{title}</Text>
      {onClose && <CloseIcon cursor="pointer" onClick={onClose} />}
    </Flex>
  )
}
