import React, { useState } from "react"
import { Box, Grid, Checkbox, Text, Flex } from "@chakra-ui/react"
import { sortAlphabetic } from "../../../utils/functions/sorting"
import { Tag } from "../../../components/tags/Tag/Tag"
import { DeleteIcon } from "../../../components/icons/DeleteIcon"
import { Popup } from "../../../components/overlay/Popup/Popup"

export const TagsAlphabeticContainer = ({ tags, onDelete }) => {
  const tagGroups = sortAlphabetic(tags.map((t) => t.name))
  const [selectedTags, setSelectedTags] = useState([])
  const [tagsToDelete, setTagsToDelete] = useState(null)

  const handleSelectAll = () => {
    if (selectedTags.length === tags.length) {
      setSelectedTags([])
      return
    }
    setSelectedTags(tags.map((t) => t.name))
  }

  const handleTagSelect = (tagName) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((st) => st !== tagName))
      return
    }
    setSelectedTags([...selectedTags, tagName])
  }

  return (
    <Box>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={tagsToDelete}
        onConfirm={() => {
          onDelete(tagsToDelete)
          setTagsToDelete(null)
        }}
        onClose={() => setTagsToDelete(null)}
      >
        {`¿Desea eliminar ${
          tagsToDelete
            ? tagsToDelete?.length > 1
              ? "los tags seleccionados"
              : tagsToDelete[0]
            : ""
        }?`}
      </Popup>
      <Flex
        align="center"
        mb="24px"
        cursor="pointer"
        width="fit-content"
        height="24px"
      >
        <Checkbox
          mr="8px"
          isChecked={selectedTags.length === tags.length}
          onChange={() => handleSelectAll()}
        />
        {selectedTags?.length > 1 ? (
          <Text
            color="error"
            variant="d_xs_regular"
            as="a"
            cursor="pointer"
            onClick={() => setTagsToDelete(selectedTags)}
          >
            <DeleteIcon
              mr="2px"
              color="error"
              width="16px"
              cursor="pointer"
              _hover={{
                color: "error"
              }}
            />
            Eliminar
          </Text>
        ) : (
          <Text
            color="gray"
            variant="d_xs_regular"
            ml="2px"
            cursor="pointer"
            onClick={handleSelectAll}
          >
            Seleccionar
          </Text>
        )}
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
                  <Checkbox
                    mr="6px"
                    onChange={() => handleTagSelect(tag)}
                    isChecked={selectedTags.includes(tag)}
                  />
                  <Tag width="fit-content">{tag}</Tag>
                </Flex>
                <DeleteIcon
                  onClick={() => setTagsToDelete([tag])}
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
