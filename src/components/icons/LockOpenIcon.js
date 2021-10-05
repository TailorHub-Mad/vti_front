import { Icon } from "@chakra-ui/react"
import React from "react"

export const LockOpenIcon = (props) => {
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
        d="M12 4.8C10.5582 4.8 9.375 6.01706 9.375 7.5V10.2H17.25C18.2165 10.2 19 11.0059 19 12V19.2C19 20.1941 18.2165 21 17.25 21H6.75C5.7835 21 5 20.1941 5 19.2V12C5 11.0059 5.7835 10.2 6.75 10.2H7.625V7.5C7.625 5.02294 9.59175 3 12 3C14.4082 3 16.375 5.02294 16.375 7.5C16.375 7.99706 15.9832 8.4 15.5 8.4C15.0168 8.4 14.625 7.99706 14.625 7.5C14.625 6.01706 13.4418 4.8 12 4.8Z"
        fill={props.fill ?? "#052E57"}
      />
    </Icon>
  )
}
