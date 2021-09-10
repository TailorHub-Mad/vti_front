import { Button, Center, Text } from "@chakra-ui/react"
import React from "react"
import { AddNoteIcon } from "../../components/icons/AddNoteIcon"
import { UploadCloudIcon } from "../../components/icons/UploadCloudIcon"

export const ViewEmptyState = ({
  children,
  message,
  importButtonText,
  addButtonText,
  onImport,
  onAdd,
  ...props
}) => {
  return (
    <Center flexDir="column" mt="150px" {...props}>
      <Text variant="d_s_medium" mb="24px">
        {children || message || "Añadir a la plataforma"}
      </Text>
      <Button
        display="flex"
        justifyContent="flex-start"
        leftIcon={<UploadCloudIcon />}
        variant="secondary"
        mb="16px"
        onClick={onImport}
        w="175px"
      >
        {importButtonText || "Importar"}
      </Button>
      <Button
        display="flex"
        justifyContent="flex-start"
        leftIcon={<AddNoteIcon />}
        onClick={onAdd}
        w="175px"
      >
        {addButtonText || "Añadir"}
      </Button>
    </Center>
  )
}
