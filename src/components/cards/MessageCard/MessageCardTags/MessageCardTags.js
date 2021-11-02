import { Box } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { TagRow } from "../../../tags/TagRow/TagRow"

export const MessageCardTags = ({ note }) => {
  const router = useRouter()

  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="28px"
      gridTemplateColumns="100%"
      width="100%"
    >
      {note.projects?.length > 0 ? (
        <TagRow
          tags={formatTags(note.projects, "alias")}
          variant={variantGeneralTag.PROJECT}
          width="100%"
          noCollapse
        />
      ) : !router.query.type === "projects" ? (
        <Box w="100%" height="28px"></Box>
      ) : null}
      {note.testSystems?.length > 0 ? (
        <TagRow
          tags={formatTags(note.testSystems, "alias")}
          variant={variantGeneralTag.SYSTEM}
          width="100%"
          noCollapse
        />
      ) : router.query.type === "testSystems" ? null : (
        <Box w="100%" height="28px"></Box>
      )}
      {note.tags?.length > 0 ? (
        <TagRow
          tags={formatTags(note.tags, "name")}
          variant={variantGeneralTag.NOTE}
          width="100%"
          noCollapse
        />
      ) : Array.isArray(note.tags) ? (
        <Box w="100%" height="28px"></Box>
      ) : null}
    </Box>
  )
}
