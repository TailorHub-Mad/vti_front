import { Button, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { AddProjectIcon } from "../../../components/icons/AddProjectIcon"
import { AddNewProjectModal } from "./AddNewProjectModal/AddNewProjectModal"

export const AddNewProject = ({ ...props }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>
        <AddProjectIcon marginRight="8px" />
        Añadir proyecto
      </Button>
      <AddNewProjectModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
