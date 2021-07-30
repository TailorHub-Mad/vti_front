import { DeleteIcon } from "@chakra-ui/icons"
import { Text } from "@chakra-ui/react"
import React from "react"
import { EditIcon } from "../../../../components/icons/EditIcon"
import { FinishIcon } from "../../../../components/icons/FinishIcon"
import { OptionsMenuItem } from "../../../../components/navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"
import { TableOptionsMenu } from "../../../../components/tables/TableOptionsMenu/TableOptionsMenu"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons_props"

export const ProjectRowOptionMenu = () => {
  return (
    <TableOptionsMenu>
      <OptionsMenuItem onClick={() => setShowOptions(true)}>
        <FinishIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
        <Text variant="d_xs_regular" marginRight="2px">
          Finalizar
        </Text>
      </OptionsMenuItem>
      <OptionsMenuItem onClick={() => setShowOptions(true)}>
        <EditIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
        <Text variant="d_xs_regular" marginRight="2px">
          Editar
        </Text>
      </OptionsMenuItem>
      <OptionsMenuItem onClick={() => setShowOptions(true)} isLast>
        <DeleteIcon {...ICONS_PROPS_16} marginRight="4px" color="error" />
        <Text variant="d_xs_regular" color="error" marginRight="2px">
          Eliminar
        </Text>
      </OptionsMenuItem>
    </TableOptionsMenu>
  )
}
