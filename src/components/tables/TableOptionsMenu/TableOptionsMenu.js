import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { ICONS_PROPS_16 } from "../../../utils/constants/icons_props"
import { HeartIcon } from "../../icons/HeartIcon"
import { OptionsIcon } from "../../icons/OptionsIcon"
import { OptionsMenu } from "../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const TableOptionsMenu = () => {
  const [showOptions, setShowOptions] = useState(false)
  return (
    <Box position="relative">
      <OptionsIcon
        {...ICONS_PROPS_16}
        color="grey"
        onClick={() => setShowOptions(true)}
      />
      <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
        <OptionsMenuItem onClick={() => setShowOptions(true)}>
          <HeartIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
          <Text variant="d_xs_regular" marginRight="2px">
            Favorito
          </Text>
        </OptionsMenuItem>
        <OptionsMenuItem onClick={() => setShowOptions(true)} isLast>
          <DeleteIcon {...ICONS_PROPS_16} marginRight="4px" color="error" />
          <Text variant="d_xs_regular" color="error" marginRight="2px">
            Eliminar
          </Text>
        </OptionsMenuItem>
      </OptionsMenu>
    </Box>
  )
}
