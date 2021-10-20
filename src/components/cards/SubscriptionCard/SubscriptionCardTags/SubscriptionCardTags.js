import { Box } from "@chakra-ui/react"
import React from "react"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { TagRow } from "../../../tags/TagRow/TagRow"

export const SubscriptionCardTags = ({ tags, ...props }) => {
  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="28px"
      gridTemplateColumns="100%"
      width="100%"
      {...props}
    >
      {tags?.length > 0 && (
        <TagRow
          tags={formatTags(tags, "name")}
          variant={variantGeneralTag.NOTE}
          flexWrap="wrap"
          height="66px"
        />
      )}
    </Box>
  )
}
