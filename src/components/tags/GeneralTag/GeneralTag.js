import { Tag, TagLabel, Text } from "@chakra-ui/react"
import React from "react"

export const GeneralTag = ({ label,variant, children, ...props }) => {
  return (
    <Tag variant={variant} borderRadius="full" {...props}>
      <TagLabel isTruncated>{label || children}</TagLabel>
    </Tag>
  )
}
