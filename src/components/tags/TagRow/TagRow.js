import { Box } from "@chakra-ui/react"
import React from "react"
import { GeneralTag } from "../GeneralTag/GeneralTag"

export const TagRow = ({ tags = [], remainingTagsCount, variant, ...props }) => {
  return (
    <Box display="flex" alignItems="center" {...props} height="28px">
      {[...tags].slice(0, 3).map((tag, idx) => (
        <GeneralTag key={`${tag}-${idx}`} variant={variant} mr="8px">
          {tag}
        </GeneralTag>
      ))}
      {remainingTagsCount > 0 ? (
        <GeneralTag
          variant={variant}
          mr="8px"
        >{`+${remainingTagsCount}`}</GeneralTag>
      ) : null}
    </Box>
  )
}
