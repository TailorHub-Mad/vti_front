import { Icon } from "@chakra-ui/react"
import React from "react"

export const AddDepartmentIcon = ({ ...props }) => {
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
        d="M18.2 14H16.8V16.8H14V18.2H16.8V21H18.2V18.2H19.6H21V16.8H20.3H18.2V15.4V14Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 19H10.25V15.5H13.75V15.8H13V19ZM19 13V10.25H15.5V13.75H15.8V13H19ZM5 19H8.5V15.5H5V19ZM10.25 13.75H13.75V10.25H10.25V13.75ZM5 13.75H8.5V10.25H5V13.75ZM15.5 8.5H19V5H15.5V8.5ZM10.25 8.5H13.75V5H10.25V8.5ZM5 8.5H8.5V5H5V8.5Z"
        fill="currentColor"
      />
    </Icon>
  )
}
