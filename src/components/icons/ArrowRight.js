import { Icon } from "@chakra-ui/icons"
import React from "react"

export const ArrowRight = ({ ...props }) => {
  return (
    <Icon
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.5 12L9.5 7V17L14.5 12Z" fill="currentColor" />
    </Icon>
  )
}
