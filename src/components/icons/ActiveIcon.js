import { Icon } from "@chakra-ui/react"
import React from "react"

export const ActiveIcon = (props) => {
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
        d="M8 4.85795V12.5795C8 13.0514 8.38883 13.4375 8.86407 13.4375H10.5922V19.5718C10.5922 20.0094 11.1711 20.1638 11.3958 19.7863L15.8803 12.1505C16.2173 11.5757 15.8025 10.8636 15.1372 10.8636H13.1844L15.3359 5.15823C15.552 4.60057 15.1372 4 14.5324 4H8.86407C8.38883 4 8 4.38608 8 4.85795Z"
        fill="currentColor"
      />
    </Icon>
  )
}
