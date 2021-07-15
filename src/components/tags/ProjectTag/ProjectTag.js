import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const ProjectTag = ({ label, ...props }) => {
  return (
    <Tag variant="project" {...props}>
      <Text isTruncated>{label}</Text>
    </Tag>
  )
}
