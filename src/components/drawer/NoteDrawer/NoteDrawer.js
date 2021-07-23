import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import faker from "faker"
faker.locale = "es"
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from "@chakra-ui/react"
import React from "react"
import { GoToButton } from "../../buttons/GoToButton/GoToButton"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../icons/ChevronUpIcon"
import { CloseIcon } from "../../icons/CloseIcon"
import { FolderCloseIcon } from "../../icons/FolderCloseIcon"
import { FormalizedIcon } from "../../icons/FormalizedICon"
import { LockCloseIcon } from "../../icons/LockCloseIcon"
import { ProjectTag } from "../../tags/ProjectTag/ProjectTag"
import { TestSystemTag } from "../../tags/TestSystemTag/TestSystemTag"
import { TestSystemLineIcon } from "../../icons/TestSystemLineIcon"
import { TagLineIcon } from "../../icons/TagLineIcon"
import { NewNoteLineIcon } from "../../icons/NewNoteLineIcon"
import { PageLineIcon } from "../../icons/PageLineIcon"
import { LinkLineIcon } from "../../icons/LinkLineIcon"
import { CloudLineIcon } from "../../icons/CloudLineIcon"
import { capitalize } from "../../../utils/functions/common"
import { PdfTypeIcon } from "../../icons/PdfTypeIcon"
import { ImageTypeIcon } from "../../icons/ImageTypeIcon"

export const NoteDrawer = ({ isOpen, onClose }) => {
  const name = `${faker.name.firstName()} ${faker.name.lastName()}`
  const note_tags = new Array(faker.datatype.number(10))
    .fill("")
    .map(() => faker.lorem.word())
  const message = faker.lorem.words(80)
  const title = `${capitalize(faker.lorem.word())} ${faker.lorem.words(4)}`
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay bgColor="blue.400" backdropFilter="blur(2px)" />
      <DrawerContent p="38.25px" bgColor="light_grey">
        <DrawerHeader
          p="0"
          fontWeight="normal"
          display="flex"
          justifyContent="space-between"
        >
          <Text variant="d_l_medium">{title}</Text>
          <CloseIcon onClick={onClose} cursor="pointer" />
        </DrawerHeader>
        <DrawerBody
          bgColor="white"
          mt="24px"
          p="32px"
          borderRadius="2px"
          boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        >
          <Flex justify="space-between">
            <Text variant="d_xs_regular" color="grey">
              16/07/2021
            </Text>
            <Flex>
              <Flex ml="16px" align="center" cursor="pointer">
                <EditIcon color="grey" width="16px" mr="4px" />
                <Text variant="d_xs_regular" color="grey">
                  Editar
                </Text>
              </Flex>
              <Flex ml="16px" align="center" cursor="pointer">
                <LockCloseIcon color="blue.500" width="16px" mr="4px" />
                <Text variant="d_xs_regular" color="blue.500">
                  Cerrado
                </Text>
              </Flex>
              <Flex ml="16px" align="center" cursor="pointer">
                <FormalizedIcon color="sgtart" width="16px" mr="4px" />
                <Text variant="d_xs_regular" color="start">
                  Formalizado
                </Text>
              </Flex>
              <Flex ml="16px" align="center" cursor="pointer">
                <DeleteIcon color="error" width="16px" mr="4px" />
                <Text variant="d_xs_regular" color="error">
                  Eliminar
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Box mt="24px">
            <Flex justify="space-between">
              <Flex align="center">
                <FolderCloseIcon mr="8px" />
                <Text variant="d_s_medium" mt="4px">
                  Proyecto
                </Text>
              </Flex>
              <GoToButton label="Ver proyecto" />
            </Flex>
            <ProjectTag mt="8px" ml="32px">
              Proyecto 1
            </ProjectTag>
          </Box>
          <Accordion allowToggle allowMultiple>
            <AccordionItem border="0px" bg="transparent">
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ background: "none", outline: "none" }}
                    _focus={{ outline: "none" }}
                    p="0"
                    pt="8px"
                    mt="24px"
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <TestSystemLineIcon mr="8px" />
                        <Text variant="d_s_medium" mt="4px">
                          Sistema de ensayo del proyecto
                        </Text>
                      </Flex>
                      {isExpanded ? (
                        <ChevronUpIcon ml="2px" />
                      ) : (
                        <ChevronDownIcon ml="2px" />
                      )}
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel pl={"32px"}>
                    <Button variant="note_content">Sistema de ensayo 1</Button>
                    <Button variant="note_content" ml="4px">
                      Sistema de ensayo 2
                    </Button>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
            <AccordionItem border="0px" bg="transparent">
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ background: "none", outline: "none" }}
                    _focus={{ outline: "none" }}
                    p="0"
                    pt="8px"
                    mt="24px"
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <TagLineIcon mr="8px" />
                        <Text variant="d_s_medium" mt="4px">
                          Tags de apunte
                        </Text>
                      </Flex>
                      {isExpanded ? (
                        <ChevronUpIcon ml="2px" />
                      ) : (
                        <ChevronDownIcon ml="2px" />
                      )}
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel pl={"32px"} pb={"8px"}>
                    {note_tags.map((note) => (
                      <TestSystemTag key={note} mr="8px" mb="8px">
                        {note}
                      </TestSystemTag>
                    ))}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
            <AccordionItem border="0px" bg="transparent">
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ background: "none", outline: "none" }}
                    _focus={{ outline: "none" }}
                    p="0"
                    pt="8px"
                    mt="24px"
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <PageLineIcon mr="8px" />
                        <Text variant="d_s_medium" mt="4px">
                          {`Mensaje creado por ${name}`}
                        </Text>
                      </Flex>
                      {isExpanded ? (
                        <ChevronUpIcon ml="2px" />
                      ) : (
                        <ChevronDownIcon ml="2px" />
                      )}
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel pl={"32px"} pb={"8px"}>
                    {message}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
            <AccordionItem border="0px" bg="transparent">
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ background: "none", outline: "none" }}
                    _focus={{ outline: "none" }}
                    p="0"
                    pt="8px"
                    mt="24px"
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <LinkLineIcon mr="8px" />
                        <Text variant="d_s_medium" mt="4px">
                          Link
                        </Text>
                      </Flex>
                      {isExpanded ? (
                        <ChevronUpIcon ml="2px" />
                      ) : (
                        <ChevronDownIcon ml="2px" />
                      )}
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel pl={"32px"} pb={"8px"}>
                    <Button variant="note_content">
                      <LinkLineIcon width="16px" />
                      www.testlink.com
                    </Button>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
            <AccordionItem border="0px" bg="transparent">
              {({ isExpanded }) => (
                <>
                  <AccordionButton
                    _hover={{ background: "none", outline: "none" }}
                    _focus={{ outline: "none" }}
                    p="0"
                    pt="8px"
                    mt="24px"
                  >
                    <Flex align="center">
                      <Flex align="center">
                        <CloudLineIcon mr="8px" />
                        <Text variant="d_s_medium" mt="4px">
                          Adjuntos
                        </Text>
                      </Flex>
                      {isExpanded ? (
                        <ChevronUpIcon ml="2px" />
                      ) : (
                        <ChevronDownIcon ml="2px" />
                      )}
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel pl={"32px"} pb={"8px"}>
                    <Button variant="note_content">
                      <PdfTypeIcon />
                      Test_file.pdf
                    </Button>
                    <Button variant="note_content" ml="8px">
                      <PdfTypeIcon />
                      Test_file.pdf
                    </Button>
                    <Button variant="note_content" ml="8px">
                      <ImageTypeIcon />
                      Test_image.jpg
                    </Button>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          </Accordion>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
