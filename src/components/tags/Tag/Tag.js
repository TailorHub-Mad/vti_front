import { TagLabel } from "@chakra-ui/tag"
import { Tag as ChakraTag } from "@chakra-ui/tag"
import React from "react"
import { variantGeneralTag } from "../../../utils/constants/tabs"

export const Tag = ({
  label,
  variant = variantGeneralTag.NOTE,
  children,
  labelProps,
  ...props
}) => {
  return (
    <ChakraTag
      display="flex"
      justifyContent="center"
      variant={variant}
      borderRadius="full"
      {...props}
    >
      <TagLabel textAlign="center">{label || children}</TagLabel>
    </ChakraTag>
  )
}
