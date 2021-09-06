import { Icon } from "@chakra-ui/icons"
import React from "react"

export const AddSectorIcon = ({ ...props }) => {
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
        d="M10.5156 18C6.51025 17.9965 3.21011 14.8562 3.00958 10.8573C2.80905 6.8584 5.77848 3.40384 9.76344 3V6.03775C7.49979 6.42015 5.88504 8.44179 6.01308 10.7331C6.14113 13.0244 7.97109 14.8537 10.2633 14.9817C12.5554 15.1097 14.5778 13.4956 14.9604 11.2327H17.9992C17.6079 15.0724 14.3766 17.9948 10.5156 18ZM18 9.72891H14.9611C14.641 7.83836 13.1592 6.35736 11.2678 6.03775V3C14.8235 3.36391 17.6348 6.17383 17.9992 9.72816L18 9.72891Z"
        fill="white"
      />
      <path
        d="M18.7 13V12.5H18.2H16.8H16.3V13V15.3H14H13.5V15.8V17.2V17.7H14H16.3V20V20.5H16.8H18.2H18.7V20V17.7H19.6H21H21.5V17.2V15.8V15.3H21H20.3H18.7V14.4V13Z"
        fill="white"
        stroke="currentColor"
      />
    </Icon>
  )
}