import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const ProjectTag = ({ label, children, ...props }) => {
  return (
    <Tag variant="project" {...props}>
      <Text isTruncated>{label || children}</Text>
    </Tag>
  )
}
