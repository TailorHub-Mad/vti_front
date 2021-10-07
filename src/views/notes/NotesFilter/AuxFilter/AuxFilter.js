import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Radio,
  Text
} from "@chakra-ui/react"
import React from "react"
import { ChevronDownIcon } from "../../../../components/icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../../../components/icons/ChevronUpIcon"
import { ProjectsIcon } from "../../../../components/icons/ProjectsIcon"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import faker from "faker"
import { sortAlphabetic } from "../../../../utils/functions/sorting"
import { Tag } from "../../../../components/tags/Tag/Tag"
import { variantGeneralTag } from "../../../../utils/constants/tabs"
export const AuxFilter = ({ onClose, ...props }) => {
  const project_tags = new Array(80)
    .fill("")
    .map(() => faker.lorem.word().toUpperCase())

  return (
    <Box
      w="620px"
      h="fit-content"
      position="absolute"
      top="50px"
      right="calc(50vw - 620px)"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <CustomModalHeader title="Ventana de apoyo" onClose={onClose} />
      <Flex direction="column" mt="24px">
        <Flex align="center" mb="24px">
          <ProjectsIcon mr="2px" />
          <Text variant="d_s_medium">Proyectos</Text>
        </Flex>
        <Accordion allowToggle allowMultiple>
          {Object.entries(sortAlphabetic(project_tags)).map(([name, group]) => (
            <AccordionItem key={name} border="0px" bg="transparent" pb={"8px"}>
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
                    <Grid templateColumns="auto auto auto" gap="8px" width="100%">
                      {group.map((tag) => (
                        <Flex key="">
                          <Radio>
                            <Tag variant={variantGeneralTag.SYSTEM}>{tag}</Tag>
                          </Radio>
                        </Flex>
                      ))}
                    </Grid>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </Box>
  )
}
