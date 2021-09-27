import { Box } from "@chakra-ui/react"
import React from "react"
import { TagRow } from "../../../tags/TagRow/TagRow"
import { GeneralTag } from "../../../tags/GeneralTag/GeneralTag"

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
        tags={relatedTags.map(tags => tags.name)}
        tagComponent={<GeneralTag />}
        remainingTagsCount={getRemainingTags(relatedTags)}
        variant="pale_yellow"
      />
      <TagRow
        tags={projects}
        tagComponent={<GeneralTag />}
        remainingTagsCount={getRemainingTags(projects)}
        variant="light_blue"
      />
    </Box>
  )
}
