import { Button, Center, Text } from "@chakra-ui/react"
import React from "react"
import { AddTestSystemIcon } from "../../../components/icons/AddTestSystemIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const TestSystemsEmptyState = ({ onAddTestSystem, onImport, ...props }) => {
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
        onClick={onImport}
      >
        Importar
      </Button>
      <Button
        display="flex"
        justifyContent="flex-start"
        leftIcon={<AddTestSystemIcon />}
        onClick={onAddTestSystem}
      >
        Añadir sistema
      </Button>
    </Center>
  )
}
