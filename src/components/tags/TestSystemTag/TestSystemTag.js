import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const TestSystemTag = ({ label, ...props }) => {
  return (
    <Tag variant="testSystem" {...props}>
      <Text isTruncated>{label}</Text>
    </Tag>
  )
}
