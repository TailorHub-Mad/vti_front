import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { ActionLink } from "../../../buttons/ActionLink/ActionLink"
import { GoToButton } from "../../../buttons/GoToButton/GoToButton"
import { FolderCloseIcon } from "../../../icons/FolderCloseIcon"
import { FormalizedIcon } from "../../../icons/FormalizedIcon"
import { LockCloseIcon } from "../../../icons/LockCloseIcon"
import { ProjectTag } from "../../../tags/ProjectTag/ProjectTag"

export const NoteMainInfo = ({ updatedAt, project }) => {
  //TODO ACTIONS DE LOS LINKS
  return (
    <>
      <Flex justify="space-between">
        <Text variant="d_xs_regular" color="grey">
          {updatedAt?.toLocaleDateString()}
        </Text>
        <Flex>
          <ActionLink color="grey" icon={<EditIcon />} label="Editar" />
          <ActionLink icon={<LockCloseIcon />} label="Cerrado" />
          <ActionLink color="start" icon={<FormalizedIcon />} label="Formalizado" />
          <ActionLink color="error" icon={<DeleteIcon />} label="Eliminar" />
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
          {project}
        </ProjectTag>
      </Box>
    </>
  )
}
