import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Checkbox, Flex, Text, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { ICONS_PROPS_16 } from "../../../../utils/constants/icons"
import { OptionsIcon } from "../../../icons/OptionsIcon"
import { OptionsMenu } from "../../../navigation/OptionsMenu/OptionsMenu"
import { OptionsMenuItem } from "../../../navigation/OptionsMenu/OptionsMenuItem/OptionsMenuItem"

export const SubscriptionCardHeader = ({
  title,
  onClick,
  onDelele,
  onCardSelected,
  checked
}) => {
  const [showOptions, setShowOptions] = useState(false)

  const handleOnDelete = () => {
    setShowOptions(false)
    onDelele()
  }

  const ref = useRef(null)

  useOutsideClick({
    ref: ref,
    handler: () => setShowOptions(false)
  })

  return (
    <Flex height="32px" justify="space-between" alignItems="center">
      <Flex onClick={onClick} cursor="pointer">
        <Checkbox mb="16px" onChange={onCardSelected} isChecked={Boolean(checked)} />
        <Text ml="8px" marginTop="2px" variant="d_s_medium" noOfLines={2}>
          {title}
        </Text>
      </Flex>
      <Box position="relative" ref={ref}>
        <OptionsIcon
          cursor="pointer"
          width="16px"
          heigth="16px"
          mb="12px"
          color="grey"
          onClick={() => setShowOptions(true)}
        />
        <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
          <OptionsMenuItem onClick={handleOnDelete} isLast>
            <DeleteIcon {...ICONS_PROPS_16} marginRight="4px" color="error" />
            <Text variant="d_xs_regular" color="error" marginRight="2px">
              Dar de baja
            </Text>
          </OptionsMenuItem>
        </OptionsMenu>
      </Box>
    </Flex>
  )
}
