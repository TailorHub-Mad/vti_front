import { Box } from "@chakra-ui/react"
import React from "react"
import { TagRow } from "../../../tags/TagRow/TagRow"
import { Tag } from "../../../tags/Tag/Tag"
import { variantGeneralTag } from "../../../../utils/constants/tabs"

export const TagCardTags = ({ projects, relatedTags }) => {
  const getRemainingTags = (tags) => {
    if (!tags) return 0
    if (tags.length <= 2) {
      return 0
    } else {
      return tags.length - 2
    }
  }

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
        remainingTagsCount={getRemainingTags(relatedTags)}
        variant={variantGeneralTag.NOTE}
      />
      <TagRow
        tags={projects}
        tagcomponent={<Tag />}
        remainingTagsCount={getRemainingTags(projects)}
        variant="light_blue"
      />
    </Box>
  )
}
