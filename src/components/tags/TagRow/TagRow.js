import { Box } from "@chakra-ui/react"
import React from "react"
import { GeneralTag } from "../GeneralTag/GeneralTag"

export const TagRow = ({ remainingTagsCount, tags = {}, variant, ...props }) => {
  //TODO A lo mejor hay que refactorizar las tags para que sólo sea una prop "color" y evitar por tipo

  return (
    <Box display="flex" alignItems="center" {...props} height="28px">
      {[...tags].slice(0, 3).map((tag) => (
        <GeneralTag key={tag} variant={variant} mr="8px">
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
