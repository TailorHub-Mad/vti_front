import { Box } from "@chakra-ui/react"
import React from "react"
import { TagRow } from "../../../tags/TagRow/TagRow"
import { Tag } from "../../../tags/Tag/Tag"
import { variantGeneralTag } from "../../../../utils/constants/tabs"

export const TagCardTags = ({ items, relatedTags = [] }) => {
  return (
    <Box
      display="grid"
      gridRowGap="8px"
      gridTemplateRows="24px"
      gridTemplateColumns="100%"
      width="100%"
      mt="8px"
      mb="16px"
    >
      <TagRow
        tags={relatedTags.map((tags) => tags.name)}
        tagcomponent={<Tag />}
        variant={variantGeneralTag.NOTE}
      />
      <TagRow tags={items} tagcomponent={<Tag />} variant="light_blue" />
    </Box>
  )
}
