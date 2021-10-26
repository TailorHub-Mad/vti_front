import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Flex, Text, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons"
import { HeartIcon } from "../../../icons/HeartIcon"
import { OptionsIcon } from "../../../icons/OptionsIcon"
import { SubscribeIcon } from "../../../icons/SubscribeIcon"
import { OptionsMenu } from "../../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const MessageCardHeader = ({
  isFavorite,
  isSubscribe,
  title,
  onClick,
  onDelele,
  onSubscribe,
  onFavorite,
  notesFromSubscription,
  ...props
}) => {
  const [showOptions, setShowOptions] = useState(false)

  const handleOnDelete = () => {
    setShowOptions(false)
    onDelele()
  }

  const handleOnFavorite = () => {
    setShowOptions(false)
    onFavorite(isFavorite)
  }

  const handleOnSubscribe = () => {
    setShowOptions(false)
    onSubscribe(isSubscribe)
  }

  const ref = useRef(null)

  useOutsideClick({
    ref: ref,
    handler: () => setShowOptions(false)
  })

  return (
    <Flex height="32px" justify="space-between" alignItems="center" {...props}>
      <Flex onClick={onClick} cursor={notesFromSubscription ? "default" : "pointer"}>
        {isFavorite ? (
          <HeartIcon color="error" {...ICONS_PROPS_16} marginRight="4px" />
        ) : null}
        <Text marginTop="2px" variant="d_s_medium" noOfLines={2}>
          {title}
        </Text>
      </Flex>
      {notesFromSubscription ? null : (
        <Box position="relative" ref={ref}>
          <OptionsIcon
            cursor="pointer"
            width="16px"
            heigth="16px"
            color="grey"
            onClick={() => setShowOptions(true)}
          />
          <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
            <OptionsMenuItem onClick={handleOnFavorite}>
              <HeartIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
              <Text variant="d_xs_regular" marginRight="2px">
                {isFavorite ? "Eliminar favorito" : "Favorito"}
              </Text>
            </OptionsMenuItem>

            <OptionsMenuItem onClick={handleOnSubscribe}>
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

            <OptionsMenuItem onClick={handleOnDelete} isLast>
              <DeleteIcon {...ICONS_PROPS_16} marginRight="4px" color="error" />
              <Text variant="d_xs_regular" color="error" marginRight="2px">
                Eliminar
              </Text>
            </OptionsMenuItem>
          </OptionsMenu>
        </Box>
      )}
    </Flex>
  )
}
