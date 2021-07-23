import { Button, Center, Text } from "@chakra-ui/react"
import React from "react"
import { AddNoteIcon } from "../../../components/icons/AddNoteIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const NotesEmptyState = ({ ...props }) => {
  return (
    <Center flexDir="column" mt="150px" {...props}>
      <Text variant="d_s_medium" mb="24px">
        Añade apuntes a la plataforma
      </Text>
      <Button
        display="flex"
        justifyContent="flex-start"
        leftIcon={<UploadCloudIcon />}
        variant="secondary"
        mb="16px"
      >
        Importar
      </Button>
      <Button display="flex" justifyContent="flex-start" leftIcon={<AddNoteIcon />}>
        Añadir apunte
      </Button>
    </Center>
  )
}
