import { Button, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { AddClientIcon } from "../../../../components/icons/AddClientIcon"
import { NewClientModal } from "./NewClientModal/NewClientModal"

export const NewClient = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>
        <AddClientIcon marginRight="8px" />
        Añadir cliente
      </Button>
      <NewClientModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
