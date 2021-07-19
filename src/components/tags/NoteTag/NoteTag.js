import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const NoteTag = ({ label, children, ...props }) => {
  return (
    <Tag variant="note" {...props}>
      <Text isTruncated>{label || children}</Text>
    </Tag>
  )
}
