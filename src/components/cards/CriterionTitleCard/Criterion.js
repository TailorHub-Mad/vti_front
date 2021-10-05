import { Button } from "@chakra-ui/button"
import { Checkbox } from "@chakra-ui/checkbox"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/layout"
import React, { useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../icons/ChevronUpIcon"
import { Tag } from "../../tags/Tag/Tag"
import { CriterionTitleCardHeader } from "./CriterionTitleCardHeader/CriterionTitleCardHeader"

export const CriterionTitleCard = ({
  selectAllTags,
  onSelect,
  tags = [],
  selectedTags = [],
  onDelete,
  ...props
}) => {
  const allSelected = tags.length === selectedTags.length
  const isChecked = false
  const [showAll, setShowAll] = useState(false)
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
      <CriterionTitleCardHeader />
      <Text variant="d_xs_regular" mb="8px">
        Fecha de creación 15/02/2021
      </Text>
      <Checkbox mr="8px" onChange={selectAllTags} isChecked={allSelected} />
      {new Array(3).fill("").map((idx) => (
        <Flex key={idx} align="center" width="100%" justify="space-between" mb="8px">
          <Flex align="center">
            <Checkbox mr="8px" onChange={onSelect} isChecked={isChecked} />
            <Tag variant="pale_yellow">hola k dise</Tag>
          </Flex>
          <DeleteIcon color="grey" onClick={onDelete} />
        </Flex>
      ))}
      {showAll &&
        new Array(3).fill("").map((idx) => (
          <Flex
            key={idx}
            align="center"
            width="100%"
            justify="space-between"
            mb="8px"
          >
            <Flex align="center">
              <Checkbox mr="8px" onChange={onSelect} isChecked={isChecked} />
              <Tag variant="pale_yellow">hola k dise</Tag>
            </Flex>
            <DeleteIcon color="grey" onClick={onDelete} cursor="pointer" />
          </Flex>
        ))}
      <Text variant="d_xs_regular" as="a" cursor="pointer">
        {showAll ? "Ver menos" : "Ver más"}
        {showAll ? (
          <ChevronUpIcon onClick={() => setShowAll(false)} />
        ) : (
          <ChevronDownIcon onClick={() => setShowAll(true)} />
        )}
      </Text>
      <Button
        mt="18px"
        height="24px"
        borderRadius="24px"
        width="100%"
        variant="secondary"
      >
        <AddIcon w="16px" h="16px" mr="4px" />{" "}
        <Text variant="d_s_regular">Añadir tag</Text>
      </Button>
    </Box>
  )
}
