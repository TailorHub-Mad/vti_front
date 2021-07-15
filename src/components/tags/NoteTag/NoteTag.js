import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const NoteTag = ({ label, ...props }) => {
  return (
    <Tag variant="note" {...props}>
      <Text isTruncated>{label}</Text>
    </Tag>
  )
}
