import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Flex, Text, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons"
import { HeartIcon } from "../../../icons/HeartIcon"
import { OptionsIcon } from "../../../icons/OptionsIcon"
import { OptionsMenu } from "../../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const MessageCardHeader = ({
  isFavorite,
  title,
  onClick,
  onDelele,
  onFavorite,
  ...props
}) => {
  const [showOptions, setShowOptions] = useState(false)

  const handleOnDelete = () => {
    setShowOptions(false)
    onDelele()
  }

  const handleOnFavorite = () => {
    setShowOptions(false)
    onFavorite()
  }

  const ref = useRef(null)

  useOutsideClick({
    ref: ref,
    handler: () => setShowOptions(false)
  })

  return (
    <Flex height="32px" justify="space-between" {...props}>
      <Flex maxWidth="80%" height="32px" onClick={onClick} cursor="pointer">
        {isFavorite ? (
          <HeartIcon color="error" {...ICONS_PROPS_16} marginRight="4px" />
        ) : null}
        <Text marginTop="2px" variant="d_s_medium" noOfLines={2}>
          {title}
        </Text>
      </Flex>
      <Box position="relative" ref={ref}>
        <OptionsIcon
          {...ICONS_PROPS_16}
          color="grey"
          onClick={() => setShowOptions(true)}
        />
        <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
          <OptionsMenuItem onClick={handleOnFavorite}>
            <HeartIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
            <Text variant="d_xs_regular" marginRight="2px">
              Favorito
            </Text>
          </OptionsMenuItem>
          <OptionsMenuItem onClick={handleOnDelete} isLast>
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
