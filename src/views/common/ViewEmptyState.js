import { Button, Flex, Text, Center } from "@chakra-ui/react"
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
  noImport,
  ...props
}) => {
  return (
    <Center>
      <Flex
        flexDir="column"
        alignItems="center"
        justify="center"
        height="calc(100vh - 400px)"
        {...props}
      >
        <Text variant="d_s_medium" mb="24px">
          {children || message || "Añadir a la plataforma"}
        </Text>
        {noImport || (
          <Button
            display="flex"
            justifyContent="flex-start"
            alignItems={"center"}
            leftIcon={<UploadCloudIcon />}
            variant="secondary"
            mb="16px"
            onClick={onImport}
            w="100%"
            maxWidth={"248px"}
            p="20px"
          >
            {importButtonText || "Importar"}
          </Button>
        )}

        <Button
          display="flex"
          justifyContent="flex-start"
          leftIcon={<AddNoteIcon />}
          onClick={onAdd}
          w="auto"
          maxWidth={"248px"}
          p="20px"
        >
          {addButtonText || "Añadir"}
        </Button>
      </Flex>
    </Center>
  )
}
