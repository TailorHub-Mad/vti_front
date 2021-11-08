import { Box, Flex, Text, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons"
import { HeartIcon } from "../../../icons/HeartIcon"
import { OptionsIcon } from "../../../icons/OptionsIcon"
import { SubscribeIcon } from "../../../icons/SubscribeIcon"
import { OptionsMenu } from "../../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const TableCardHeader = ({
  isFavorite,
  isSubscribe,
  title,
  onClick,
  onSubscribe,
  onFavorite,
  type,
  ...props
}) => {
  const [showOptions, setShowOptions] = useState(false)

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
      <Flex onClick={onClick} cursor={"pointer"} gridGap="8px">
        {type === "projects" && isFavorite ? (
          <HeartIcon {...ICONS_PROPS_16} />
        ) : null}

        {isSubscribe ? <SubscribeIcon {...ICONS_PROPS_16} /> : null}
        <Text marginTop="2px" variant="d_s_medium" noOfLines={2}>
          {title}
        </Text>
      </Flex>

      <Box position="relative" ref={ref}>
        <OptionsIcon
          cursor="pointer"
          width="16px"
          heigth="16px"
          color="grey"
          onClick={() => setShowOptions(true)}
        />
        <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
          {type === "projects" && (
            <OptionsMenuItem onClick={handleOnFavorite}>
              <HeartIcon {...ICONS_PROPS_16} marginRight="4px" color="blue.500" />
              <Text variant="d_xs_regular" marginRight="2px">
                {isFavorite ? "Eliminar favorito" : "Favorito"}
              </Text>
            </OptionsMenuItem>
          )}

          <OptionsMenuItem onClick={handleOnSubscribe} isLast>
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
        </OptionsMenu>
      </Box>
    </Flex>
  )
}
