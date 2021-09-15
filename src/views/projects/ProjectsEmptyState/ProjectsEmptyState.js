import { Button, Center, Text } from "@chakra-ui/react"
import React from "react"
import { AddNoteIcon } from "../../../components/icons/AddNoteIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const ProjectsEmptyState = ({ onAddProject, onImport, ...props }) => {
  return (
    <Center flexDir="column" mt="150px" {...props}>
      <Text variant="d_s_medium" mb="24px">
        Añade proyectos a la plataforma
      </Text>
      <Button
        display="flex"
        justifyContent="flex-start"
        leftIcon={<UploadCloudIcon />}
        variant="secondary"
        mb="16px"
        onClick={onImport}
      >
        Importar
      </Button>
      <Button display="flex" justifyContent="flex-start" leftIcon={<AddNoteIcon />} onClick={onAddProject}>
        Añadir proyecto
      </Button>
    </Center>
  )
}
