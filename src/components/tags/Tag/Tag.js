import { TagLabel } from "@chakra-ui/tag"
import { Tag as ChakraTag } from "@chakra-ui/tag"
import React from "react"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const Tag = ({
  label,
  variant = variantGeneralTag.NOTE,
  children,
  ...props
}) => {
  return (
    <ChakraTag variant={variant} borderRadius="full" {...props}>
      <TagLabel isTruncated>{label || children}</TagLabel>
    </ChakraTag>
  )
}
