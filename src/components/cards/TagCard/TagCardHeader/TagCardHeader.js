import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Text, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons_props"
import { OptionsIcon } from "../../../icons/OptionsIcon"
import { OptionsMenu } from "../../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const TagCardHeader = ({
  title,
  onClick,
  category = "Verdura",
  father,
  ...props
}) => {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <Flex height="32px" justify="space-between" {...props}>
      <Box maxWidth="80%" height="32px" onClick={onClick} cursor="pointer">
        <Text marginTop="2px" variant="d_m_medium">
          {title}
        </Text>
        <Text marginTop="2px" variant="d_xs_regular" casing="uppercase">
          {father ? `${father} · ${category}` : category}
        </Text>
      </Box>
      <Box position="relative">
        <OptionsIcon
          {...ICONS_PROPS_16}
          color="grey"
          onClick={() => setShowOptions(true)}
        />
        <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
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
        </OptionsMenu>
      </Box>
    </Flex>
  )
}
