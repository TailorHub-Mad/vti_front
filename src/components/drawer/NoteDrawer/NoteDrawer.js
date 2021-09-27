import { Box, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { CloseIcon } from "../../icons/CloseIcon"
import { NoteMainInfo } from "./NoteMainInfo/NoteMainInfo"
import { NoteDetailsAccordion } from "./NoteAccordion/NoteDetailsAccordion"
import { CollapseIconHor } from "../../icons/CollapseIconHor"

export const NoteDrawer = ({
  note,
  isOpen,
  onClose,
  handleUpdate,
  onDelete,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!note) return null
  return (
    <>
      {isOpen ? (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bgColor="blue.500"
          zIndex="998"
          opacity="0.8"
        />
      ) : null}
      <Box
        transform={`translateX(${isOpen ? "0px" : "536.5px"})`}
        onClose={onClose}
        top="0"
        right="-10px"
        position="fixed"
        width={isExpanded && isOpen ? "100vw" : "536.5px"}
        transition="all 0.3s ease-in"
        zIndex="999"
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
            <NoteMainInfo note={note} onEdit={handleUpdate} onDelete={onDelete} />
            <NoteDetailsAccordion
              name={note.name}
              // noteTags={note.tags}
              // testSystems={note.test_systems}
              link={note.link}
              // message={note.messages}
              files={note.document}
            />
          </Box>
          {note.messages &&
            note.messages.map((msg, idx) => (
              <Box
                key={`${msg.id}-${idx}`}
                bgColor="white"
                mt="24px"
                p="32px"
                borderRadius="2px"
                boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
              >
                <NoteMainInfo
                  updatedAt={msg.updatedAt}
                  project={msg.project}
                  isResponse
                />
                <NoteDetailsAccordion
                  isResponse
                  name={msg.name}
                  links={msg.links}
                  message={msg.message}
                  files={msg.files}
                />
              </Box>
            ))}
        </Box>
      </Box>
    </>
  )
}
