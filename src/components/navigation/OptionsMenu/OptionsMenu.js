import { Box, useOutsideClick } from "@chakra-ui/react"
import React, { useRef } from "react"

export const OptionsMenu = ({ isOpen, onClose, children, ...props }) => {
  const ref = useRef(null)
  useOutsideClick({
    ref: ref,
    handler: () => onClose()
  })
  return isOpen ? (
    <Box
      position="absolute"
      top="-22px"
      right="24px"
      bgColor="white"
      ref={ref}
      borderRadius="2px"
      boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
      width="112px"
      height="fit-content"
      zIndex="900"
      {...props}
    >
      {children}
    </Box>
  ) : null
}
