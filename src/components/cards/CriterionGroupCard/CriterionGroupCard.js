import { Button } from "@chakra-ui/button"
import { Checkbox } from "@chakra-ui/checkbox"
import { AddIcon } from "@chakra-ui/icons"
import { Flex, Text } from "@chakra-ui/layout"
import React, { useEffect, useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../icons/ChevronUpIcon"
import { DeleteIcon } from "../../icons/DeleteIcon"
import { Tag } from "../../tags/Tag/Tag"
import { CriterionGroupCardHeader } from "./CriterionGroupCardHeader/CriterionGroupCardHeader"

export const CriterionGroupCard = ({
  group,
  onAdd,
  onEdit,
  onDeleteTags,
  onDeleteGroup,
  onAddTags,
  ...props
}) => {
  const [showAll, setShowAll] = useState(false)
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const isChecked = (id) => {
    return selectedTags.includes(id)
  }

  const handleTagSelect = (id) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((t) => t !== id))
      return
    }
    setSelectedTags([...selectedTags, id])
  }

  const selectAllTags = () => {
    if (selectedTags.length === tags.length) {
      setSelectedTags([])
      return
    }
    setSelectedTags(tags.map((t) => t._id))
  }
  const showMoroLess = () => {
    if (group.relatedTags?.length > 3) return true
    if (!showAll && tags?.length < group.relatedTags?.length) return false
  }

  useEffect(() => {
    if (showAll) setTags(group.relatedTags)
    else setTags([...group.relatedTags]?.splice(0, 3))
  }, [showAll])

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      bgColor="white"
      border="1px solid #c9c9c9"
      borderRadius="2px"
      w="266px"
      minH="293px"
      h="fit-content"
      p="16px"
      {...props}
    >
      <Flex direction="column">
        <CriterionGroupCardHeader
          title={group.name}
          onEdit={onEdit}
          onDelete={onDeleteGroup}
        />
        <Text variant="d_xs_regular" mb="8px">
          {`Fecha de creación ${new Date(group.createdAt).toLocaleDateString()}`}
        </Text>

        {tags?.length > 0 ? (
          <Flex align="center" mb="16px" cursor="pointer">
            <Checkbox
              onChange={selectAllTags}
              isChecked={selectedTags.length === tags.length}
              mr="8px"
            />

            {selectedTags?.length > 1 ? (
              <Text
                color="error"
                variant="d_s_regular"
                as="a"
                cursor="pointer"
                onClick={() => onDeleteTags(selectedTags)}
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
                variant="d_s_regular"
                mt="4px"
                mb="4px"
                cursor="pointer"
                onClick={selectAllTags}
              >
                Seleccionar
              </Text>
            )}
          </Flex>
        ) : null}

        {tags?.map((tag, idx) => (
          <Flex
            key={idx}
            align="center"
            width="100%"
            justify="space-between"
            mb="8px"
          >
            <Flex align="center">
              <Checkbox
                mr="8px"
                onChange={() => handleTagSelect(tag._id)}
                isChecked={isChecked(tag._id)}
              />
              <Tag variant="pale_yellow">{tag.name}</Tag>
            </Flex>

            <DeleteIcon
              color="light_grey"
              width="16px"
              cursor="pointer"
              onClick={() => onDeleteTags([tag._id])}
              _hover={{
                color: "grey"
              }}
            />
          </Flex>
        ))}

        {showMoroLess() ? (
          <Text variant="d_xs_regular" as="a" cursor="pointer">
            {showAll ? "Ver menos" : "Ver más"}
            {showAll ? (
              <ChevronUpIcon onClick={() => setShowAll(false)} />
            ) : (
              <ChevronDownIcon onClick={() => setShowAll(true)} />
            )}
          </Text>
        ) : null}
      </Flex>

      <Button
        mt="18px"
        height="24px"
        borderRadius="24px"
        width="100%"
        variant="secondary"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        onClick={onAdd}
      >
        <AddIcon w="12px" h="12px" mr="4px" />{" "}
        <Text variant="d_s_regular" mt="4px" onClick={onAddTags}>
          Añadir tag
        </Text>
      </Button>
    </Flex>
  )
}
