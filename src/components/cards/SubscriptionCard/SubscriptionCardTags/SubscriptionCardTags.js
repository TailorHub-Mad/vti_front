import { Box } from "@chakra-ui/react"
import React from "react"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { TagRow } from "../../../tags/TagRow/TagRow"

export const SubscriptionCardTags = ({ tags }) => {
  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="28px"
      gridTemplateColumns="100%"
      width="100%"
    >
      {tags?.length > 0 && (
        <TagRow
          max="5"
          tags={formatTags(tags, "name")}
          variant={variantGeneralTag.NOTE}
          flexWrap="wrap"
          height="66px"
        />
      )}
    </Box>
  )
}
