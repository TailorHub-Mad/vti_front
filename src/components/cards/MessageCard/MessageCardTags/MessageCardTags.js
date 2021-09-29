import { Box } from "@chakra-ui/react"
import React from "react"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { TagRow } from "../../../tags/TagRow/TagRow"

export const MessageCardTags = ({ note }) => {
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
          variant={variantGeneralTag.PROJECT}
        />
      )}
      {note.testSystems && (
        <TagRow
          tags={formatTags(note.testSystems, "alias")}
          variant={variantGeneralTag.SYSTEM}
        />
      )}
      {note.tags && (
        <TagRow
          tags={formatTags(note.tags, "name")}
          variant={variantGeneralTag.NOTE}
        />
      )}
    </Box>
  )
}
