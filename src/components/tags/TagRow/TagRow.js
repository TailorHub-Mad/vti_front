import { Box } from "@chakra-ui/react"
import React from "react"
import { Tag } from "../Tag/Tag"

export const TagRow = ({ tags = [], max = 3, variant, ...props }) => {
  const remainingTagsCount = tags.length < max ? 0 : tags.length - max

  return (
    <Box display="flex" alignItems="center" {...props} height="28px">
      {[...tags].slice(0, max).map((tag, idx) => (
        <Tag key={`${tag}-${idx}`} variant={variant} mr="8px">
          {tag}
        </Tag>
      ))}
      {remainingTagsCount > 0 ? (
        <Tag variant={variant} mr="8px">{`+${remainingTagsCount}`}</Tag>
      ) : null}
    </Box>
  )
}
