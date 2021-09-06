import { Button, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { AddTestSystemIcon } from "../../../../components/icons/AddTestSystemIcon"
import { NewClientModal } from "./NewTestSystemModal/NewTestSystemModal"

export const NewTestSystem = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>
        <AddTestSystemIcon marginRight="8px" />
        Añadir sistema
      </Button>
      <NewClientModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
