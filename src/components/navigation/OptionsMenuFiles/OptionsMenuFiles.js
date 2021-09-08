import { Text, Flex } from "@chakra-ui/react"
import React from "react"
import { UploadCloudIcon } from "../../icons/UploadCloudIcon"
import { FolderCloseIcon } from "../../icons/FolderCloseIcon"
import { OptionsMenuItem } from "../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"
import { ICONS_PROPS_16 } from "../../../utils/constants/icons_props"
import { OptionsMenu } from "../OptionsMenu/OptionsMenu"

export const OptionsMenuFiles = ({ onImport, onExport }) => {
  return (
    <Flex position="absolute" top="75px" right="5px" justifyContent="flex-end">
      <OptionsMenu isOpen={true} onClose={() => {}}>
        <OptionsMenuItem onClick={() => onImport()}>
          <UploadCloudIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
          <Text variant="d_xs_medium" marginRight="2px">
            Importar
          </Text>
        </OptionsMenuItem>
        <OptionsMenuItem onClick={() => onExport()} isLast>
          <FolderCloseIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
          <Text variant="d_xs_medium" color="blue.500" marginRight="2px">
            Exportar
          </Text>
        </OptionsMenuItem>
      </OptionsMenu>
    </Flex>
  )
}
