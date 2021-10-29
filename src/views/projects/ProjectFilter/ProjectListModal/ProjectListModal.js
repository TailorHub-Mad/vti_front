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
import { ChevronDownIcon } from "../../../../components/icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../../../components/icons/ChevronUpIcon"
import { ProjectsIcon } from "../../../../components/icons/ProjectsIcon"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import { Tag } from "../../../../components/tags/Tag/Tag"
import { sortAlphabetic } from "../../../../utils/functions/sorting"

export const ProjectListModal = ({
  projects,
  onSelectProject,
  selectedProject,
  ...props
}) => {
  const [expandAll, setExpandAll] = useState(false)
  const [expandedItems, setExpandedItems] = useState([0])

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
      w="620px"
      h="fit-content"
      top="50px"
      bgColor="transparent"
      zIndex="3000"
      ml="50px"
      mb="200px"
      pb="200px"
      {...props}
    >
      <Box bgColor="white" padding="32px">
        <CustomModalHeader title="Proyectos" />
        <Flex direction="column" mt="24px">
          <Flex mb="24px" justify="space-between" align="center" w="100%">
            <Flex>
              <Flex align="center">
                <ProjectsIcon mr="2px" color="blue.500" />
                <Text variant="d_s_medium" mt="4px" color="blue.500">
                  Proyectos
                </Text>
              </Flex>
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

          <Accordion allowToggle allowMultiple index={expandedItems}>
            {Object.entries(sortAlphabetic(projects.map((t) => t.alias))).map(
              ([name, group], idx) => (
                <AccordionItem key={name} border="0px" bg="transparent" pb={"8px"}>
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
                          templateColumns="auto auto auto"
                          gap="8px"
                          width="100%"
                        >
                          {group.map((_project) => (
                            <Flex key={_project} cursor="pointer">
                              <Checkbox
                                mr="4px"
                                onChange={() => onSelectProject(_project)}
                                isChecked={selectedProject === _project}
                              />
                              <Tag
                                variant={"pale_yellow"}
                                onClick={() => onSelectProject(_project)}
                                width="auto"
                                maxW="150px"
                              >
                                {_project}
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
