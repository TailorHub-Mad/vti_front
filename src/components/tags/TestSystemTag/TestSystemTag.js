import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const TestSystemTag = ({ label, children,...props }) => {
  return (
    <Tag variant="testSystem" {...props}>
      <Text isTruncated>{label ||children}</Text>
    </Tag>
  )
}
