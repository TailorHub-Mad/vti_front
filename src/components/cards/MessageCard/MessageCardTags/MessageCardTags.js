import { Box } from "@chakra-ui/react"
import React from "react"
import { TagRow } from "../../../tags/TagRow/TagRow"

const variantByTagName = {
  notes_tags: "pale_yellow",
  project_tags: "violete",
  test_system_tags: "light_blue"
}

export const MessageCardTags = ({ note }) => {
  const getRemainingTags = (tags) => (tags.length <= 2 ? 0 : tags.length - 2)

  const formatTags = (tags, field) => {
    const data = Array.isArray(tags) ? tags : [{ ...tags }]
    return data.map((tag) => tag[field])
  }

  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="28px"
      gridTemplateColumns="100%"
      width="100%"
    >
      {note.projects && (
        <TagRow
          tags={formatTags(note.projects, "alias")}
          variant={variantByTagName["project_tags"]}
          remainingTagsCount={getRemainingTags(note.projects)}
        />
      )}
      {note.testSystems && (
        <TagRow
          tags={formatTags(note.testSystems, "alias")}
          variant={variantByTagName["test_system_tags"]}
          remainingTagsCount={getRemainingTags(note.testSystems)}
        />
      )}
      {note.tags && (
        <TagRow
          tags={formatTags(note.tags, "name")}
          variant={variantByTagName["notes_tags"]}
          remainingTagsCount={getRemainingTags(note.tags)}
        />
      )}
    </Box>
  )
}
