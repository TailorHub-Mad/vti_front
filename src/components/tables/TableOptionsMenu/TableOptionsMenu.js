import {Flex } from "@chakra-ui/react"
import React, { useState } from "react"
import { ICONS_PROPS_16 } from "../../../utils/constants/icons_props"
import { OptionsIcon } from "../../icons/OptionsIcon"
import { OptionsMenu } from "../../navigation/OptionsMenu/OptionsMenu"

export const TableOptionsMenu = ({ children, ...props }) => {
  const [showOptions, setShowOptions] = useState(false)
  return (
    <Flex position="relative" {...props} justifyContent="flex-end">
      <OptionsIcon
        {...ICONS_PROPS_16}
        color="grey"
        onClick={() => setShowOptions(true)}
      />
      <OptionsMenu isOpen={showOptions} onClose={() => setShowOptions(false)}>
        {children}
      </OptionsMenu>
    </Flex>
  )
}
