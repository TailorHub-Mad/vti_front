import { Flex, Text, useMediaQuery } from "@chakra-ui/react"
import React from "react"
import { CloseIcon } from "../../../icons/CloseIcon"

export const CustomModalHeader = ({ onClose, title, ...props }) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  return (
    <Flex
      justify="space-between"
      align="center"
      height="33px"
      {...props}
      mt={["32px", null, null, "0"]}
      mb={["24px", null, null, "0"]}
    >
      <Text variant={isScreen ? "d_l_medium" : "d_m_medium"}>{title}</Text>
      {onClose && (
        <CloseIcon
          w={isScreen ? "16px" : "12px"}
          h={isScreen ? "16px" : "12px"}
          cursor="pointer"
          onClick={onClose}
        />
      )}
    </Flex>
  )
}
