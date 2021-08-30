import { Icon } from "@chakra-ui/react"
import React from "react"

export const ConversationIcon = ({ ...props }) => {
  return (
    <Icon
      width="25px"
      height="24px"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.25 4.8V17.4L7.57 14.16C7.88124 13.9257 8.26042 13.7993 8.65 13.8H15.85C16.8441 13.8 17.65 12.9941 17.65 12V4.8C17.65 3.80589 16.8441 3 15.85 3H5.05C4.05589 3 3.25 3.80589 3.25 4.8ZM5.25 12V5H15.75C15.75 5 15.75 11.5 15.75 12H5.25Z"
        fill="currentColor"
      />
      <path
        d="M21.25 21V9.3C21.25 8.30589 20.4441 7.5 19.45 7.5V17.4L17.5294 15.96C17.2183 15.7254 16.839 15.599 16.4494 15.6H7.75C7.75 16.5941 8.55589 17.4 9.55 17.4H15.85C16.2396 17.3993 16.6188 17.5257 16.93 17.76L21.25 21Z"
        fill="currentColor"
      />
    </Icon>
  )
}
