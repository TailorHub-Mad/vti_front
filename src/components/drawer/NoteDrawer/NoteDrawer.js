import { Box, Button, Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { CloseIcon } from "../../icons/CloseIcon"
import { NoteMainInfo } from "./NoteMainInfo/NoteMainInfo"
import { NoteDetailsAccordion } from "./NoteAccordion/NoteDetailsAccordion"
import { CollapseIconHor } from "../../icons/CollapseIconHor"
import useNoteApi from "../../../hooks/api/useNoteApi"

export const NoteDrawer = ({
  note: noteFromProject,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onResponse,
  onEditResponse,
  onDeleteResponse,
  fromProjectDetail,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { getNote } = useNoteApi()

  const [note, setNote] = useState()

  const formatMessage = (msg) => ({
    ...msg,
    isClosed: msg.approved
  })

  useEffect(() => {
    if (!noteFromProject) return
    const _getNote = async () => {
      const newNote = await getNote(null, noteFromProject._id)
      setNote(newNote[0].notes[0])
    }
    _getNote()
  }, [noteFromProject])
  if (!noteFromProject) return null
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
      {note ? (
        <Box
          transform={`translateX(${isOpen ? "0px" : "536.5px"})`}
          onClose={onClose}
          top="0"
          right={["0", null, null, "-10"]}
          position="fixed"
          width={isExpanded && isOpen ? "100vw" : ["100%", null, null, "536.5px"]}
          transition={["none", null, null, "all 0.3s ease-in"]}
          zIndex={["99999", null, null, "999"]}
          {...props}
        >
          <Box
            p={["16px", null, null, "32px"]}
            pb={["112px", null, null, null]}
            bgColor="light_grey"
            h="100vh"
            overflowY="scroll"
          >
            <Flex justify="space-between" align="center">
              <Text variant="d_l_medium">{note.title}</Text>
              <CloseIcon onClick={onClose} cursor="pointer" />
            </Flex>
            <Flex
              display={["none", null, null, "flex"]}
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
              p={["16px", null, null, "32px"]}
              borderRadius="2px"
              boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
            >
              <NoteMainInfo
                item={note}
                onEdit={onEdit}
                onDelete={onDelete}
                fromProjectDetail={fromProjectDetail}
                note={note}
              
              />
              <NoteDetailsAccordion
                name={note.owner[0].name}
                link={note.link}
                description={note.description}
                noteTags={note.tags.length > 0 && note.tags}
                testSystems={note?.testSystems.length > 0 ? note.testSystems : null}
                files={note.documents?.length > 0 ? note.documents : null}
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
                    onDelete={() => onDeleteResponse(note._id, msg._id)}
                    isMessage
                    note={note}
                  />
                  <NoteDetailsAccordion
                    isMessage
                    name={msg.owner[0]?.alias}
                    link={msg.link}
                    files={msg.documents?.length > 0 ? msg.documents : null}
                    message={msg.message}
                  />
                </Box>
              )
            })}
            <Flex
              justifyContent={["center", null, null, "flex-start"]}
              position={["fixed", null, null, "relative"]}
              bottom={["0", null, null, null]}
              left={["0", null, null, null]}
              width="100%"
              pb={["8px", null, null, null]}
              pt={["8px", null, null, null]}
              boxShadow={["0px -4px 8px rgba(5, 46, 87, 0.1)", null, null, "none"]}
              bgColor={["white", null, null, "transparent"]}
            >
              <Button mt="24px" onClick={onResponse}>
                Escribir respuesta
              </Button>
            </Flex>
          </Box>
        </Box>
      ) : null}
    </>
  )
}
