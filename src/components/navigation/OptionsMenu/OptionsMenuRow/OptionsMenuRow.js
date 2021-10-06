import { DeleteIcon } from "@chakra-ui/icons"
import { Text } from "@chakra-ui/react"
import React from "react"
import { EditIcon } from "../../../icons/EditIcon"
import { FinishIcon } from "../../../icons/FinishIcon"
import { OptionsMenuItem } from "../OptionsMenuItem/OptionsMenuItem"
import { TableOptionsMenu } from "../../../tables/TableOptionsMenu/TableOptionsMenu"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons"

export const OptionsMenuRow = ({
  onEdit,
  onDelete,
  onClose,
  keyGroup,
  isGrouped,
  disabled,
  close,
  id
}) => {
  console.log("isGrouped", isGrouped, keyGroup, id)
  return (
    <TableOptionsMenu disabled={disabled}>
      {close ? (
        <OptionsMenuItem
          onClick={() => onClose(isGrouped ? { [id]: { key: keyGroup } } : id)}
        >
          <FinishIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
          <Text variant="d_xs_regular" marginRight="2px">
            Finalizar
          </Text>
        </OptionsMenuItem>
      ) : null}
      <OptionsMenuItem
        onClick={() => onEdit(isGrouped ? { [id]: { key: keyGroup } } : id)}
      >
        <EditIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
        <Text variant="d_xs_regular" marginRight="2px">
          Editar
        </Text>
      </OptionsMenuItem>
      <OptionsMenuItem
        onClick={() => onDelete(isGrouped ? { [id]: { key: keyGroup } } : id)}
        isLast
      >
        <DeleteIcon {...ICONS_PROPS_16} marginRight="4px" color="error" />
        <Text variant="d_xs_regular" color="error" marginRight="2px">
          Eliminar
        </Text>
      </OptionsMenuItem>
    </TableOptionsMenu>
  )
}
