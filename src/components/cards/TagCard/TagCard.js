import { Box, Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import { PATHS } from "../../../utils/constants/global"
import { TagCardHeader } from "./TagCardHeader/TagCardHeader"
import { TagCardTags } from "./TagCardTags/TagCardTags"

export const TagCard = ({
  _id,
  name,
  updatedAt,
  projects,
  parent,
  relatedTags,
  category,
  onEdit,
  onDelete
}) => {
  const router = useRouter()

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
        parent={parent?.name}
        category={category}
        onEdit={onEdit}
        onDelete={onDelete}
        onClick={() => router.push(`${PATHS.projectTags}/${_id}`)}
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
