import { Tag, Text } from "@chakra-ui/react"
import React from "react"

export const ProjectTag = ({ label, children, ...props }) => {
  return (
    <Tag variant="project" {...props}>
      <Text variant="d_xs_regular" isTruncated>
        {label || children}
      </Text>
    </Tag>
  )
}
