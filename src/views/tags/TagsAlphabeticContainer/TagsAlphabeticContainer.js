import React from "react"
import { Box, Grid, Checkbox, Text, Flex } from "@chakra-ui/react"
import { sortAlphabetic } from "../../../utils/functions/sorting"
import { Tag } from "../../../components/tags/Tag/Tag"
import { DeleteIcon } from "../../../components/icons/DeleteIcon"

export const TagsAlphabeticContainer = ({ tags, onDelete }) => {
  const tagGroups = sortAlphabetic(tags.map((t) => t.name))
  return (
    <Box>
      <Flex align="center" mb="24px">
        <Checkbox mr="8px" /> <Text color="grey">Seleccionar</Text>
      </Flex>
      {Object.entries(tagGroups).map(([name, tags]) => (
        <Box key={name} mb="24px">
          <Text variant="d_s_medium" mb="8px">
            {name.toUpperCase()}
          </Text>
          <Grid templateColumns="22% 22% 22% 22%" columnGap="4%" rowGap="8px">
            {tags.map((tag) => (
              <Flex key={tag} align="center" justify="space-between">
                <Flex align="center">
                  <Checkbox mr="6px" />
                  <Tag width="fit-content">{tag}</Tag>
                </Flex>
                <DeleteIcon
                  onClick={onDelete}
                  width="16px"
                  color="light_grey"
                  mb="2px"
                  mr="8px"
                  cursor="pointer"
                  _hover={{
                    color: "grey"
                  }}
                />
              </Flex>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  )
}
