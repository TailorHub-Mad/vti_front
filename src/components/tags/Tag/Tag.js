import { Tag as ChakraTag, TagLabel } from "@chakra-ui/react"
import React from "react"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const Tag = ({
  label,
  variant = variantGeneralTag.NOTE,
  children,
  ...props
}) => {
  console.log("lo que llega", label, children)
  return (
    <ChakraTag variant={variant} borderRadius="full" {...props}>
      <TagLabel isTruncated>{label || children}</TagLabel>
    </ChakraTag>
  )
}
