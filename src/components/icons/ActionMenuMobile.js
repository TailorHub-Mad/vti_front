import { Icon } from "@chakra-ui/react"
import React from "react"

export const ActionMenuMobile = (props) => {
  return (
    <Icon
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9 9H5V5H9V9Z" fill="#052E57" />
      <path d="M19 9H15V5H19V9Z" fill="#052E57" />
      <path d="M9 19H5V15H9V19Z" fill="#052E57" />
      <path d="M19 19H15V15H19V19Z" fill="#052E57" />
    </Icon>
  )
}
