import { DeleteIcon } from "@chakra-ui/icons"
import { Text } from "@chakra-ui/react"
import React, { useContext } from "react"
import { EditIcon } from "../../../icons/EditIcon"
import { FinishIcon } from "../../../icons/FinishIcon"
import { OptionsMenuItem } from "../OptionsMenuItem/OptionsMenuItem"
import { TableOptionsMenu } from "../../../tables/TableOptionsMenu/TableOptionsMenu"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons"
import { SubscribeIcon } from "../../../icons/SubscribeIcon"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { RoleType } from "../../../../utils/constants/global"
import { HeartIcon } from "../../../icons/HeartIcon"

export const OptionsMenuRow = ({
  onEdit,
  onDelete,
  onClose,
  onSubscribe,
  onFavorite,
  isSubscribe,
  isFavorite,
  keyGroup,
  isGrouped,
  disabled,
  close,
  subscribed,
  favorited,
  id
}) => {
  const { role } = useContext(ApiAuthContext)

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
      {subscribed && role === RoleType.USER ? (
        <OptionsMenuItem
          onClick={() =>
            onSubscribe(isGrouped ? { [id]: { key: keyGroup } } : id, isSubscribe)
          }
        >
          <SubscribeIcon
            {...ICONS_PROPS_16}
            marginRight="4px"
            color={isSubscribe ? "error" : "blue.500"}
          />
          <Text
            variant="d_xs_regular"
            marginRight="2px"
            color={isSubscribe ? "error" : "blue.500"}
          >
            {isSubscribe ? "Darme de baja" : "Suscribirme"}
          </Text>
        </OptionsMenuItem>
      ) : null}
      {favorited && role === RoleType.USER ? (
        <OptionsMenuItem
          onClick={() =>
            onFavorite(isGrouped ? { [id]: { key: keyGroup } } : id, isFavorite)
          }
          isLast={favorited && role === RoleType.USER}
        >
          <HeartIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
          <Text variant="d_xs_regular" marginRight="2px">
            {isFavorite ? "Eliminar favorito" : "Favorito"}
          </Text>
        </OptionsMenuItem>
      ) : null}
      {role === RoleType.ADMIN ? (
        <>
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
        </>
      ) : null}
    </TableOptionsMenu>
  )
}
