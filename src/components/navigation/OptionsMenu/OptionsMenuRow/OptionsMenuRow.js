import { DeleteIcon } from "@chakra-ui/icons"
import { Text } from "@chakra-ui/react"
import React from "react"
import { EditIcon } from "../../../icons/EditIcon"
import { OptionsMenuItem } from "../OptionsMenuItem/OptionsMenuItem"
import { TableOptionsMenu } from "../../../tables/TableOptionsMenu/TableOptionsMenu"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons_props"

export const OptionsMenuRow = ({ onEdit, onDelete, disabled, id }) => {
  return (
    <TableOptionsMenu disabled={disabled}>
      <OptionsMenuItem onClick={() => onEdit(id)}>
        <EditIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
        <Text variant="d_xs_regular" marginRight="2px">
          Editar
        </Text>
      </OptionsMenuItem>
      <OptionsMenuItem onClick={() => onDelete(id)} isLast>
        <DeleteIcon {...ICONS_PROPS_16} marginRight="4px" color="error" />
        <Text variant="d_xs_regular" color="error" marginRight="2px">
          Eliminar
        </Text>
      </OptionsMenuItem>
    </TableOptionsMenu>
  )
}
