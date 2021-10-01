import { Box, Button, Text, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { ExportIcon } from "../../icons/ExportIcon"
import { UploadCloudIcon } from "../../icons/UploadCloudIcon"
import { OptionsMenu } from "../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const CloudButton = ({ onImport, onExport }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box position="relative">
      <Button
        variant="icon_only_secondary"
        marginRight="16px"
        onClick={onOpen}
      >
        <UploadCloudIcon />
      </Button>
      <OptionsMenu
        onClose={onClose}
        isOpen={isOpen}
        top="56px"
        right="16px"
        w="94px"
      >
        <OptionsMenuItem onClick={onImport}>
          <UploadCloudIcon mr="8px" width="16px" heigth="16px" />
          <Text mt="3px">Importar</Text>
        </OptionsMenuItem>
        <OptionsMenuItem onClick={onExport} isLast>
          <ExportIcon mr="8px" width="16px" heigth="16px" />
          <Text>Exportar</Text>
        </OptionsMenuItem>
      </OptionsMenu>
    </Box>
  )
}
