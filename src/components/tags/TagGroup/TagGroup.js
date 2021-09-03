import { Flex } from "@chakra-ui/react"
import React from "react"
import { GeneralTag } from "../GeneralTag/GeneralTag"

export const TagGroup = ({ tagsArr, variant, max, ...props }) => {
  if (!max || tagsArr?.length <= +max) {
    return (
      <Flex>
        {tagsArr.map((tag) => {
          return (
            <GeneralTag key={tag} variant={variant} {...props} marginRight="4px">
              {tag}
            </GeneralTag>
          )
        })}
      </Flex>
    )
  }
  return (
    <Flex>
      {[...tagsArr].slice(0, max).map((tag) => {
        return (
          <GeneralTag key={tag} variant={variant} {...props} marginRight="4px">
            {tag}
          </GeneralTag>
        )
      })}
      <GeneralTag
        variant={variant}
        {...props}
        width="32px"
        marginRight="4px"
        justifyContent="center"
      >
        {`+${tagsArr?.length - max}`}
      </GeneralTag>
    </Flex>
  )
}
