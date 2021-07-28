import { Button, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { NotesIcon } from "../../icons/NotesIcon"
import { GroupModal } from "./GroupModal/GroupModal"

export const Group = ({ ...props }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button variant="tool_button" mr="16px" onClick={onOpen}>
        <NotesIcon mr={["0","8px"]} />
        Agrupar
      </Button>
      <GroupModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
