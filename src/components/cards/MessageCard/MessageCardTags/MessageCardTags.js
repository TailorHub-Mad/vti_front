import { Box } from "@chakra-ui/react"
import React from "react"
import { TagRow } from "../../../tags/TagRow/TagRow"

export const MessageCardTags = ({ tags }) => {
  const getRemainingTags = (tags) => {
    if (tags.length <= 2) {
      return 0
    } else {
      return tags.length - 2
    }
  }
  const variantByTagName = {
    test_system_tags: "pale_yellow",
    project_tags: "violete",
    notes_tags: "light_blue",
  }

  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="28px"
      gridTemplateColumns="100%"
      width="100%"
    >
      {Object.entries(tags).map(([tagName, tags], idx) => (
        <TagRow
          key={`${tagName}${idx}`}
          tags={tags}
          variant={variantByTagName[tagName]}
          remainingTagsCount={getRemainingTags(tags)}
        />
      ))}
    </Box>
  )
}
