import { Box, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { TagCardHeader } from "./TagCardHeader/TagCardHeader"
import { TagCardTags } from "./TagCardTags/TagCardTags"

export const TagCard = ({
  name,
  updatedAt,
  projects,
  parentTag,
  relatedTags,
  category,
  onEdit,
  onDelete
}) => {
  return (
    <Box
      bgColor="white"
      border="1px solid #c9c9c9"
      borderRadius="2px"
      w="266px"
      h="159px"
      p="16px"
    >
      <TagCardHeader
        title={name}
        parentTag={parentTag}
        category={category}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <TagCardTags
        projects={projects.map((p) => p.alias)}
        relatedTags={relatedTags}
      />
      <Flex justify="space-between">
        <Text variant="d_xs_regular" color="grey">
          ID
        </Text>
        <Text variant="d_xs_regular" color="grey">{`últ. actualización ${new Date(
          updatedAt
        ).toLocaleDateString()}`}</Text>
      </Flex>
    </Box>
  )
}
