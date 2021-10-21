import { Box } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { Tooltip, Tag } from "../Tag/Tag"

export const TagRow = ({ tags = [], variant, ...props }) => {
  const TAG_WIDTH_NUM = 82

  const ref = useRef()

  const [remainingTagsCount, setRemainingTagsCount] = useState(0)
  const [size, setSize] = useState()
  const [max, setMax] = useState(tags?.length)

  useEffect(() => {
    const newMax = Math.trunc(size / TAG_WIDTH_NUM)
    setMax(newMax)
    setRemainingTagsCount(tags.length < newMax ? 0 : tags.length - newMax)
  }, [size])
  function updateSize() {
    setSize(ref?.current?.offsetWidth)
  }
  useEffect(() => {
    window?.addEventListener("resize", updateSize)
    updateSize()

    return () => window?.removeEventListener("resize", updateSize)
  }, [updateSize])

  return (
    <Box
      ref={ref}
      display="flex"
      alignItems="center"
      height="28px"
      gridGap="8px"
      {...props}
    >
      {[...tags].slice(0, max).map((tag, idx) => (
        <Tooltip
          key={`${tag}-${idx}`}
          variant={variant}
          width={"62px"}
          minWidth={"62px"}
        >
          {tag}
        </Tooltip>
      ))}
      {remainingTagsCount > 0 ? (
        <Tag
          width={"32px"}
          minWidth={"32px"}
          variant={variant}
        >{`+${remainingTagsCount}`}</Tag>
      ) : null}
    </Box>
  )
}
