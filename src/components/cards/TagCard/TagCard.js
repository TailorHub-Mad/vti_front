import { Box, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { TagCardHeader } from "./TagCardHeader/TagCardHeader"
import { TagCardTags } from "./TagCardTags/TagCardTags"

export const TagCard = ({ name, updatedAt, projects, relatedTags, ...props }) => {
  return (
    <Box
      bgColor="white"
      border="1px solid #c9c9c9"
      borderRadius="2px"
      w="266px"
      h="159px"
      p="16px"
      {...props}
    >
      <TagCardHeader title={name} />

      <TagCardTags
        projects={projects}
        relatedTags={relatedTags}
      />
      <Flex justify="space-between">
        <Text variant="d_xs_regular">ID</Text>
        <Text variant="d_xs_regular">{`últ. actualización ${updatedAt.toLocaleDateString()}`}</Text>
      </Flex>
    </Box>
  )
}
