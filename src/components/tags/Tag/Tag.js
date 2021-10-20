import { TagLabel } from "@chakra-ui/tag"
import { Tag as ChakraTag } from "@chakra-ui/tag"
import React from "react"
import { variantGeneralTag } from "../../../utils/constants/tabs"
import { Tooltip as ChakraTooltip } from "@chakra-ui/react"

export const Tag = React.forwardRef(
  ({ label, variant = variantGeneralTag.NOTE, children, ...props }, ref) => {
    return (
      <ChakraTag
        ref={ref}
        display="flex"
        justifyContent="center"
        variant={variant}
        borderRadius="full"
        width="62px"
        {...props}
      >
        <TagLabel textAlign="center">{label || children}</TagLabel>
      </ChakraTag>
    )
  }
)

export const Tooltip = ({ children, ...props }) => {
  return (
    <ChakraTooltip
      label={children}
      bg="blue.500"
      color="white"
      p="8px"
      borderRadius="2px"
    >
      <Tag {...props}>{children}</Tag>
    </ChakraTooltip>
  )
}
