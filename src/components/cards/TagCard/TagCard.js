import { Box, Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import { PATHS } from "../../../utils/constants/global"
import { TagCardHeader } from "./TagCardHeader/TagCardHeader"
import { TagCardTags } from "./TagCardTags/TagCardTags"

export const TagCard = ({ tag, onEdit, onDelete, isProjectTag }) => {
  const router = useRouter()

  const handleItemTags = () => {
    if (isProjectTag) return tag?.projects?.map((p) => p.alias)
    return tag?.notes?.map((p) => p.title)
  }

  return (
    <Box
      bgColor="white"
      border="1px solid #c9c9c9"
      borderRadius="2px"
      w={["100%", null, null, "266px"]}
      h="159px"
      p="16px"
    >
      <TagCardHeader
        title={tag?.name}
        parent={tag?.parent?.name}
        onEdit={onEdit}
        onDelete={onDelete}
        onClick={() =>
          isProjectTag
            ? router.push(`${PATHS.projectTags}/${tag?._id}`)
            : router.push(`${PATHS.noteTags}/${tag?._id}`)
        }
      />

      <TagCardTags items={handleItemTags()} relatedTags={tag?.relatedTags} />
      <Flex justify="space-between">
        <Text variant="d_xs_regular" color="grey">
          ID
        </Text>
        <Text variant="d_xs_regular" color="grey">{`últ. actualización ${new Date(
          tag?.updatedAt
        ).toLocaleDateString()}`}</Text>
      </Flex>
    </Box>
  )
}
