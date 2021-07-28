import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Slide,
  SlideFade,
  Text,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { CloseIcon } from "../../icons/CloseIcon"
import { NOTE_MOCK } from "../../../mock/note"
import { NoteMainInfo } from "./NoteMainInfo/NoteMainInfo"
import { NoteDetailsAccordion } from "./NoteAccordion/NoteDetailsAccordion"
import { CollapseIconHor } from "../../icons/CollapseIconHor"

export const NoteDrawer = ({ isOpen, note = NOTE_MOCK, onClose, ...props }) => {
  //TODO fecth detalle del proyecto o por props
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <Box
      transform={`translateX(${isOpen ? "0px" : "536.5px"})`}
      onClose={onClose}
      top="0"
      right="-10px"
      position="fixed"
      width={isExpanded && isOpen ? "100vw" : "536.5px"}
      transition="all 0.3s ease-in"
      zIndex="9990"
      {...props}
    >
      <Box p="38.25px" bgColor="light_grey" h="100vh" overflowY="scroll">
        <Flex justify="space-between" align="center">
          <Text variant="d_l_medium">{note.title}</Text>
          <CloseIcon onClick={onClose} cursor="pointer" />
        </Flex>
        <Flex
          height="100vh"
          width="32px"
          alignItems="center"
          justifyContent="center"
          onClick={() => setIsExpanded(!isExpanded)}
          position="absolute"
          left="0px"
          top="0"
          cursor="pointer"
        >
          <CollapseIconHor />
        </Flex>
        <Box
          bgColor="white"
          mt="24px"
          p="32px"
          borderRadius="2px"
          boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        >
          <NoteMainInfo updatedAt={note.updatedAt} project={note.project} />
          <NoteDetailsAccordion
            name={note.name}
            noteTags={note.note_tags}
            testSystems={note.test_systems}
            links={note.links}
            message={note.message}
            files={note.files}
          />
        </Box>
      </Box>
    </Box>
  )
}
