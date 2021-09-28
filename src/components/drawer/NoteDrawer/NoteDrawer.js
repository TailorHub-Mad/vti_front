import { Box, Button, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { CloseIcon } from "../../icons/CloseIcon"
import { NoteMainInfo } from "./NoteMainInfo/NoteMainInfo"
import { NoteDetailsAccordion } from "./NoteAccordion/NoteDetailsAccordion"
import { CollapseIconHor } from "../../icons/CollapseIconHor"

export const NoteDrawer = ({
  note,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onResponse,
  onEditResponse,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatMessage = (msg) => ({
    ...msg,
    isClosed: msg.approved
  })

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
            <NoteMainInfo item={note} onEdit={onEdit} onDelete={onDelete} />
            <NoteDetailsAccordion
              name={note.name}
              noteTags={note.tags}
              // testSystems={note.test_systems}
              link={note.link}
              // message={note.messages}
              files={note.document}
            />
          </Box>
          {note.messages.map((msg, idx) => {
            if (!msg.owner[0]) return null
            return (
              <Box
                key={`${msg._id}-${idx}`}
                bgColor="white"
                mt="24px"
                p="32px"
                borderRadius="2px"
                boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
              >
                <NoteMainInfo
                  item={formatMessage(msg)}
                  onEdit={() => onEditResponse(msg)}
                  isMessage
                />
                <NoteDetailsAccordion
                  isMessage
                  name={msg.owner[0]?.alias}
                  link={msg.link}
                  files={msg.document}
                  message={msg.message}
                />
              </Box>
            )
          })}
          <Button mt="24px" onClick={onResponse}>
            Escribir respuesta
          </Button>
        </Box>
      </Box>
    </>
  )
}
