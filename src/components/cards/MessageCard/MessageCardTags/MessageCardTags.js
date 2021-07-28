import { Box } from "@chakra-ui/react"
import React from "react"
import { NoteTag } from "../../../tags/NoteTag/NoteTag"
import { ProjectTag } from "../../../tags/ProjectTag/ProjectTag"
import { TestSystemTag } from "../../../tags/TestSystemTag/TestSystemTag"

const TagRow = ({ remainingTagsCount, tagComponent, tags = {}, ...props }) => {
  return (
    <Box display="flex" alignItems="center" {...props} height="28px">
      {[...tags]
        .slice(0, 2)
        .map((tag) => React.cloneElement(tagComponent, { label: tag, marginRight: "8px" }))}
      {remainingTagsCount > 0
        ? React.cloneElement(tagComponent, { label: `+${remainingTagsCount}` })
        : null}
    </Box>
  )
}
export const MessageCardTags = ({ tags }) => {
  const getRemainingTags = (tags) => {
    if (tags.length <= 2) {
      return 0
    } else {
      return tags.length - 2
    }
  }
  const CompontentByTagType = {
    test_system_tags: <TestSystemTag />,
    project_tags: <ProjectTag />,
    notes_tags: <NoteTag />,
  }

  return (
    <Box display="grid" gridRowGap="8px" gridTemplateRows="28px"gridTemplateColumns="100%" width="100%" >
      {Object.entries(tags).map(([tagName, tags],idx) => (
        <TagRow
          key={`${tagName}${idx}`}
          tags={tags}
          tagComponent={CompontentByTagType[tagName]}
          remainingTagsCount={getRemainingTags(tags)}
        />
      ))}
    </Box>
  )
}
