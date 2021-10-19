import { Checkbox } from "@chakra-ui/checkbox"
import { Flex, Text } from "@chakra-ui/layout"
import React, { useEffect, useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../icons/ChevronUpIcon"
import { Tag } from "../../tags/Tag/Tag"
import { CriterionGroupSupportCardHeader } from "./CriterionGroupSupportCardHeader/CriterionGroupSupportCardHeader"

export const CriterionGroupSupportCard = ({
  group,
  onTagsSelect,
  selectedTags,
  ...props
}) => {
  const [showAll, setShowAll] = useState(false)
  const [tags, setTags] = useState([])
  const areAllChecked =
    selectedTags &&
    selectedTags.filter((t) => tags.map((_t) => _t.name).includes(t)).length ===
      tags.length
  const showMoroLess = () => {
    if (group.relatedTags?.length > 3) return true
    if (!showAll && tags?.length < group.relatedTags?.length) return false
  }

  const handleSelectAll = () => {
    //si están ya todas o no
    //onTagsSelect(tags.map((t) => t.name))
    if (areAllChecked) {
      onTagsSelect(tags.map((t) => t.name))
      return
    }
    const _unchecked = tags
      .map((t) => t.name)
      .filter((tg) => !selectedTags.includes(tg))
    onTagsSelect(_unchecked)
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
        <CriterionGroupSupportCardHeader title={group.name} />
        <Text variant="d_xs_regular" mb="8px">
          {`Fecha de creación ${new Date(group.createdAt).toLocaleDateString()}`}
        </Text>

        {tags?.length > 0 ? (
          <Flex align="center" mb="16px" cursor="pointer">
            <Checkbox
              onChange={() => handleSelectAll()}
              isChecked={areAllChecked}
              mr="8px"
            />

            <Text
              color="gray"
              variant="d_s_regular"
              mt="4px"
              mb="4px"
              cursor="pointer"
              onClick={() => handleSelectAll()}
            >
              Seleccionar
            </Text>
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
                onChange={() => onTagsSelect([tag.name])}
                isChecked={selectedTags && selectedTags.includes(tag.name)}
              />
              <Tag variant="pale_yellow">{tag.name}</Tag>
            </Flex>
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
    </Flex>
  )
}
