import { Box } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { TagRow } from "../../../tags/TagRow/TagRow"

export const TableCardTags = ({ testSystems, tags }) => {
  const router = useRouter()

  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="28px"
      gridTemplateColumns="100%"
      width="100%"
    >
      {testSystems?.length > 0 ? (
        <TagRow
          tags={formatTags(testSystems, "alias")}
          variant={variantGeneralTag.SYSTEM}
          width="100%"
          noCollapse
        />
      ) : router.query.type === "testSystems" ? null : (
        <Box w="100%" height="28px"></Box>
      )}
      {tags?.length > 0 ? (
        <TagRow
          tags={formatTags(tags, "name")}
          variant={variantGeneralTag.NOTE}
          width="100%"
          noCollapse
        />
      ) : Array.isArray(tags) ? (
        <Box w="100%" height="28px"></Box>
      ) : null}
    </Box>
  )
}
