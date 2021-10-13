import { Button } from "@chakra-ui/button"
import { Checkbox } from "@chakra-ui/checkbox"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/layout"
import React, { useEffect, useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../icons/ChevronUpIcon"
import { Tag } from "../../tags/Tag/Tag"
import { CriterionTitleCardHeader } from "./CriterionTitleCardHeader/CriterionTitleCardHeader"

export const CriterionTitleCard = ({
  help,
  onAdd,
  onEdit,
  onDelete,
  selectAllTags,
  onSelect,
  selectedTags = [],
  ...props
}) => {
  const [showAll, setShowAll] = useState(false)
  const [tags, setTags] = useState([])

  const allSelected = tags?.length === selectedTags?.length
  const isChecked = false

  const showMoroLess = () => {
    if (tags?.length > 0) return false
    if (!showAll && tags?.length < help.relatedTags?.length) return false
  }

  useEffect(() => {
    if (showAll) setTags(help.relatedTags)
    else setTags(help.relatedTags?.splice(0, 3))
  }, [showAll])

  return (
    <Box
      bgColor="white"
      border="1px solid #c9c9c9"
      borderRadius="2px"
      w="266px"
      minH="293px"
      h="fit-content"
      p="16px"
      {...props}
    >
      <CriterionTitleCardHeader
        title={help.title}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <Text variant="d_xs_regular" mb="8px">
        {`Fecha de creación ${new Date(help.createdAt).toLocaleDateString()}`}
      </Text>

      {tags?.length > 0 ? (
        <Checkbox mb="16px" onChange={selectAllTags} isChecked={allSelected}>
          <Text color="gray" variant="d_s_regular">
            Seleccionar
          </Text>
        </Checkbox>
      ) : null}

      {tags?.map((tag, idx) => (
        <Flex key={idx} align="center" width="100%" justify="space-between" mb="8px">
          <Flex align="center">
            <Checkbox mr="8px" onChange={onSelect} isChecked={isChecked} />
            <Tag variant="pale_yellow">{tag.name}</Tag>
          </Flex>
          <DeleteIcon
            color="grey"
            cursor="pointer"
            onClick={onDelete}
            _hover={{
              stroke: "red",
              fill: "white"
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
        <Text variant="d_s_regular">Añadir tag</Text>
      </Button>
    </Box>
  )
}
