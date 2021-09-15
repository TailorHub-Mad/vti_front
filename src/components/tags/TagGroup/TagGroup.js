import { Flex } from "@chakra-ui/react"
import React from "react"
import { GeneralTag } from "../GeneralTag/GeneralTag"

export const TagGroup = ({ tagsArr = [], variant, max, ...props }) => {
  if (!max || tagsArr?.length <= max) {
    return (
      <Flex width="100%" maxWidth="100%">
        {tagsArr.map((tag, idx) => {
          return (
            <GeneralTag
              key={`${tag}-${idx}`}
              variant={variant}
              {...props}
              marginRight="4px"
            >
              {tag}
            </GeneralTag>
          )
        })}
      </Flex>
    )
  }
  const remaining = tagsArr && [...tagsArr]?.slice(max)?.length
  return (
    <Flex width="100%" maxWidth="100%">
      {[...tagsArr]?.slice(0, max)?.map((tag, idx) => {
        return (
          <GeneralTag
            key={`${tag}-${idx}`}
            variant={variant}
            {...props}
            marginRight="4px"
          >
            {tag}
          </GeneralTag>
        )
      })}
      {remaining > 0 ? (
        <GeneralTag
          variant={variant}
          {...props}
          width="32px"
          marginRight="4px"
          justifyContent="center"
          minWidth="28px"
        >
          {`+${[...tagsArr].slice(max).length}`}
        </GeneralTag>
      ) : null}
    </Flex>
  )
}
