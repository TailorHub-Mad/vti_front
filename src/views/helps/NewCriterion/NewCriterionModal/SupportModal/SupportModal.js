import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Grid,
  Text
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
  const [activeTab, setActiveTab] = useState(ORDER.board)
  return (
    <Box
      w="620px"
      h="fit-content"
      position="absolute"
      top="50px"
      right="calc(50vw - 620px)"
      bgColor="transparent"
      zIndex="3000"
      mb="200px"
      pb="200px"
      {...props}
    >
      <Box bgColor="white" padding="32px">
        <CustomModalHeader title="Ventana de apoyo" onClose={onClose} />
        <Flex direction="column" mt="24px">
          <Flex mb="24px">
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
                    mr="8px"
                    mb="8px"
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
          <Accordion allowToggle allowMultiple>
            {activeTab === ORDER.board
              ? criteria
                  .sort((a, b) => (b.order > a.order ? -1 : 1))
                  .filter((cr) => cr.group.length >= 1)
                  .map((criterion) => (
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
                            />
                          </AccordionPanel>
                        </>
                      )}
                    </AccordionItem>
                  ))
              : Object.entries(sortAlphabetic(usedTags.map((t) => t.name))).map(
                  ([name, group]) => (
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
                              templateColumns="auto auto auto"
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
