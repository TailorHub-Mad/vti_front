import { Flex, Tag, Text } from "@chakra-ui/react"
import React from "react"

export const TagGroup = ({ tagsArr, variant, max, ...props }) => {
  if (!max || tagsArr?.length <= +max) {
    return (
      <Flex>
        {tagsArr.map((tag) => {
          return (
            <Tag key={tag} variant={variant} {...props} marginRight="4px">
              <Text isTruncated>{tag}</Text>
            </Tag>
          )
        })}
      </Flex>
    )
  }
  return (
    <Flex>
      {[...tagsArr].slice(0, max).map((tag) => {
        return (
          <Tag key={tag} variant={variant} {...props} marginRight="4px">
            <Text isTruncated>{tag}</Text>
          </Tag>
        )
      })}
      <Tag  variant={variant} {...props} marginRight="4px">
        <Text>{`+${tagsArr?.length - max}`}</Text>
      </Tag>
    </Flex>
  )
}
