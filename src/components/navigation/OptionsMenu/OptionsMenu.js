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
      right="12px"
      top="16px"
      bgColor="white"
      ref={ref}
      onClick={() => onClose()}
      borderRadius="2px"
      boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
      width="112px"
      height="fit-content"
      zIndex={100}
      {...props}
    >
      {children}
    </Box>
  ) : null
}
