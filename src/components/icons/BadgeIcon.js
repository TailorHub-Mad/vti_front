import { Icon } from "@chakra-ui/icons"
import React from "react"

export const BadgeIcon = (props) => {
  return (
    <Icon
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 15.4998L5.01 4.49976C5.00999 3.39908 5.89934 2.50526 7 2.49976L17 2.49976C18.1007 2.50526 18.99 3.39908 18.99 4.49976L19 15.4998C19.0002 16.147 18.6873 16.7544 18.16 17.1298L12 21.4998L5.84 17.1298C5.31274 16.7544 4.99975 16.147 5 15.4998ZM17 15.4998L7 15.4998H12.5L17 15.4998Z"
        fill="currentColor"
      />
    </Icon>
  )
}
