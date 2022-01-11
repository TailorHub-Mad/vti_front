import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Grid,
  Text,
  useMediaQuery
} from "@chakra-ui/react"
import React, { useState } from "react"
import { ProjectsIcon } from "../../../../../components/icons/ProjectsIcon"
import { DepartmentIcon } from "../../../../../components/icons/DepartmentIcon"
import { CustomModalHeader } from "../../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import { sortAlphabetic } from "../../../../../utils/functions/sorting"
import { ChevronUpIcon } from "../../../../../components/icons/ChevronUpIcon"
import { ChevronDownIcon } from "../../../../../components/icons/ChevronDownIcon"
import { Tag } from "../../../../../components/tags/Tag/Tag"
import { CriterionContainer } from "../../../CriterionContainer/CriterionContainer"

const ORDER = {
  board: "board",
  alphabetic: "alphabetic"
}

export const SupportModal = ({
  onClose,
  unusedTags,
  usedTags,
  criteria,
  onTagsSelect,
  selectedTags,
  ...props
}) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")

  const [activeTab, setActiveTab] = useState(ORDER.board)
  const [expandAll, setExpandAll] = useState(false)
  const [expandedItems, setExpandedItems] = useState([])
  const handleExpandedItems = (_idx) => {
    if (expandedItems.includes(_idx)) {
      const nextItems = expandedItems.filter((idx) => idx !== _idx)
      setExpandedItems(nextItems)
    } else {
      setExpandedItems([...expandedItems, _idx])
    }
  }
  const handleExpandAll = (isExpanding) => {
    if (isExpanding) {
      setExpandedItems(new Array(30).fill("").map((_, idx) => idx))
    } else {
      setExpandedItems([])
    }
  }

  return (
    <Box
      w={["100%", null, null, "620px"]}
      h={["100vh", null, null, "fit-content"]}
      position="absolute"
      top={["0", null, null, "50px"]}
      right={["0", null, null, "calc(50vw - 620px)"]}
      left={["0", null, null, "auto"]}
      bgColor="transparent"
      zIndex="10008"
      mb={["0", null, null, "200px"]}
      pb={["0", null, null, "200px"]}
      {...props}
    >
      <Box
        bgColor="white"
        padding={["16px", null, null, "32px"]}
        minHeight={isScreen ? null : "100%"}
      >
        <CustomModalHeader title="Ventana de apoyo" onClose={onClose} />
        <Flex direction="column" mt="24px">
          <Flex mb="24px" justify="space-between" align="center" w="100%">
            <Flex>
              <Flex
                align="center"
                onClick={() => setActiveTab(ORDER.board)}
                cursor="pointer"
              >
                <DepartmentIcon
                  mr="2px"
                  color={activeTab === ORDER.board ? "blue.500" : "grey"}
                />
                <Text
                  variant="d_s_medium"
                  mt="4px"
                  color={activeTab === ORDER.board ? "blue.500" : "grey"}
                >
                  Tablero
                </Text>
              </Flex>
              <Flex
                align="center"
                ml="16px"
                onClick={() => setActiveTab(ORDER.alphabetic)}
                cursor="pointer"
              >
                <ProjectsIcon
                  mr="2px"
                  color={activeTab === ORDER.alphabetic ? "blue.500" : "grey"}
                />
                <Text
                  variant="d_s_medium"
                  mt="4px"
                  color={activeTab === ORDER.alphabetic ? "blue.500" : "grey"}
                >
                  Alfabético
                </Text>
              </Flex>
              <Flex />
            </Flex>
            <Text
              mt="4px"
              variant="d_s_medium"
              cursor="pointer"
              onClick={() => {
                handleExpandAll(!expandAll)
                setExpandAll(!expandAll)
              }}
            >
              {expandAll ? "Contraer todos" : "Expandir todos"}
            </Text>
          </Flex>

          {unusedTags?.length > 0 ? (
            <Box mb="40px">
              <Text variant="d_m_medium" mb="8px">
                Tags no utilizados
              </Text>
              <Flex width="100%" wrap="wrap">
                {unusedTags.map((tag, idx) => (
                  <Tag
                    cursor="pointer"
                    key={`${tag}-${idx}`}
                    height="32px"
                    variant="violete"
                    m="8px"
                  >
                    <Checkbox
                      size="sm"
                      borderColor="blue.500"
                      mr="4px"
                      onChange={() => onTagsSelect([tag.name])}
                      isChecked={selectedTags?.includes(tag.name)}
                    />
                    <Text
                      variant="d_xs_regular"
                      display="inline"
                      onClick={() => onTagsSelect([tag.name])}
                    >
                      {tag.name}
                    </Text>
                  </Tag>
                ))}
              </Flex>
            </Box>
          ) : null}
          <Accordion allowToggle allowMultiple index={expandedItems}>
            {activeTab === ORDER.board
              ? criteria
                  .sort((a, b) => (b.order > a.order ? -1 : 1))
                  .filter((cr) => cr.group.length >= 1)
                  .map((criterion, idx) => (
                    <AccordionItem
                      key={criterion._id}
                      border="0px"
                      bg="transparent"
                      pb={"8px"}
                    >
                      {({ isExpanded }) => (
                        <>
                          <AccordionButton
                            _hover={{ background: "transparent", outline: "none" }}
                            _focus={{ outline: "none" }}
                            p={"0px 8px"}
                            mb={"0px"}
                            mt="8px"
                            onClick={() => handleExpandedItems(idx)}
                          >
                            <Flex align="center">
                              <Text variant="d_m_medium" mt="4px">
                                {criterion.title}
                              </Text>
                              {isExpanded ? (
                                <ChevronUpIcon ml="2px" />
                              ) : (
                                <ChevronDownIcon ml="2px" />
                              )}
                            </Flex>
                          </AccordionButton>
                          <AccordionPanel p={"0px 8px"} pb={"8px"}>
                            <CriterionContainer
                              selectedTags={selectedTags}
                              key={criterion._id}
                              criterion={criterion}
                              onTagSelect={(_tags) => onTagsSelect(_tags)}
                              isSupport
                              isScreen={isScreen}
                            />
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  ))
              : Object.entries(sortAlphabetic(usedTags.map((t) => t.name))).map(
                  ([name, group], idx) => (
                    <AccordionItem
                      key={name}
                      border="0px"
                      bg="transparent"
                      pb={"8px"}
                    >
                      {({ isExpanded }) => (
                        <>
                          <AccordionButton
                            _hover={{ background: "light_grey", outline: "none" }}
                            _focus={{ outline: "none" }}
                            p={"8px"}
                            mb={"8px"}
                            onClick={() => handleExpandedItems(idx)}
                          >
                            <Flex align="center">
                              <Text variant="d_s_medium" mt="4px">
                                {name}
                              </Text>
                              {isExpanded ? (
                                <ChevronUpIcon ml="2px" />
                              ) : (
                                <ChevronDownIcon ml="2px" />
                              )}
                            </Flex>
                          </AccordionButton>
                          <AccordionPanel p={"8px"} pb={"8px"}>
                            <Grid
                              templateColumns={isScreen ? "33% 33% 33%" : "100%"}
                              gap="8px"
                              width="100%"
                            >
                              {group.map((tag) => (
                                <Flex key={tag} cursor="pointer">
                                  <Checkbox
                                    mr="4px"
                                    onChange={() => onTagsSelect([tag])}
                                    isChecked={selectedTags?.includes(tag)}
                                  />
                                  <Tag
                                    variant={"pale_yellow"}
                                    onClick={() => onTagsSelect([tag])}
                                    width="auto"
                                    maxW="100px"
                                  >
                                    {tag}
                                  </Tag>
                                </Flex>
                              ))}
                            </Grid>
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  )
                )}
          </Accordion>
        </Flex>
      </Box>
    </Box>
  )
}
