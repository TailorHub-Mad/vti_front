import { Box } from "@chakra-ui/react"
import React from "react"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { TagRow } from "../../../tags/TagRow/TagRow"

export const TableCardTags = ({ testSystems, projects, notes, tags, type }) => {
  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="28px"
      gridTemplateColumns="100%"
      width="100%"
    >
      {projects?.length > 0 ? (
        <TagRow
          tags={formatTags(projects, "alias")}
          variant={variantGeneralTag.SYSTEM}
          width="100%"
          noCollapse
        />
      ) : type === "projects" ? null : (
        <Box w="100%" height="28px"></Box>
      )}

      {notes?.length > 0 && notes[0]?.title ? (
        <TagRow
          tags={formatTags(notes, "title")}
          variant={variantGeneralTag.NOTE}
          width="100%"
          noCollapse
        />
      ) : type === "projects" ? null : (
        <Box w="100%" height="28px"></Box>
      )}

      {testSystems?.length > 0 ? (
        <TagRow
          tags={formatTags(testSystems, "alias")}
          variant={variantGeneralTag.SYSTEM}
          width="100%"
          noCollapse
        />
      ) : type === "testSystems" ? null : (
        <Box w="100%" height="28px"></Box>
      )}
      {tags?.length > 0 ? (
        <TagRow
          tags={formatTags(tags, "name")}
          variant={variantGeneralTag.NOTE}
          width="100%"
          noCollapse
        />
      ) : type === "testSystems" ? null : (
        <Box w="100%" height="28px"></Box>
      )}
    </Box>
  )
}
