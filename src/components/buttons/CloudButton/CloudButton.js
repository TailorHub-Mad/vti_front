import { Box, Button, Text, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { ExportIcon } from "../../icons/ExportIcon"
import { UploadCloudIcon } from "../../icons/UploadCloudIcon"
import { OptionsMenu } from "../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const CloudButton = ({ onImport, onExport, isDisabled }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleOnImport = () => {
    onClose()
    onImport()
  }

  const handleOnExport = () => {
    onClose()
    onExport()
  }

  return (
    <Box position="relative">
      <Button
        variant="icon_only_secondary"
        marginRight="16px"
        onClick={onOpen}
        isDisabled={isDisabled}
        borderWidth="1px"
      >
        <UploadCloudIcon />
      </Button>
      <OptionsMenu
        onClose={onClose}
        isOpen={isOpen}
        top="56px"
        right="16px"
        w="94px"
        height="64px"
      >
        <OptionsMenuItem onClick={handleOnImport} width="100%" p="9.5px">
          <UploadCloudIcon mr="8px" width="16px" heigth="16px" />
          <Text variant="d_xs_regular" mt="3px">
            Importar
          </Text>
        </OptionsMenuItem>
        <OptionsMenuItem onClick={handleOnExport} width="100%" isLast>
          <ExportIcon mr="8px" width="16px" heigth="16px" />
          <Text variant="d_xs_regular">Exportar</Text>
        </OptionsMenuItem>
      </OptionsMenu>
    </Box>
  )
}
