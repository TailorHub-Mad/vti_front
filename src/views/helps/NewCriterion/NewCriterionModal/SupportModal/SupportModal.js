import { Box, Flex, Text } from "@chakra-ui/react"
import React from "react"
import faker from "faker"
import { ProjectsIcon } from "../../../../../components/icons/ProjectsIcon"
import { CustomModalHeader } from "../../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"

export const SupportModal = ({ onClose, ...props }) => {
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
        <Flex>
          <Flex align="center" mb="24px">
            <ProjectsIcon mr="2px" />
            <Text variant="d_s_medium">Tablero</Text>
          </Flex>
          <Flex align="center" mb="24px">
            <ProjectsIcon mr="2px" />
            <Text variant="d_s_medium">Alfabético</Text>
          </Flex>
        </Flex>
        <Text>Modal bajo control</Text>
        {/* <Accordion allowToggle allowMultiple>
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
        </Accordion> */}
      </Flex>
    </Box>
  )
}
