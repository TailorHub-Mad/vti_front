import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const NoteTag = ({ label, children, ...props }) => {
  return (
    <Tag variant="note" {...props}>
      <Text variant="d_xs_regular" isTruncated>
        {label || children}
      </Text>
    </Tag>
  )
}
