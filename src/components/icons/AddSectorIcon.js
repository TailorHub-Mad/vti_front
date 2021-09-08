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
        d="M18.2 13H16.8V15.8H14V17.2H16.8V20H18.2V17.2H19.6H21V15.8H20.3H18.2V14.4V13Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.00958 10.8573C3.21011 14.8562 6.51025 17.9965 10.5156 18C11.384 17.9988 12.2205 17.8501 13 17.5766V14.8H15.8V12H17.8813C17.9332 11.7489 17.9727 11.4929 17.9992 11.2327H14.9604C14.5778 13.4956 12.5554 15.1097 10.2633 14.9817C7.97109 14.8537 6.14113 13.0244 6.01308 10.7331C5.88504 8.44179 7.49979 6.42015 9.76344 6.03775V3C5.77848 3.40384 2.80905 6.8584 3.00958 10.8573ZM17.6014 13H16.8V14.6075C17.1272 14.1107 17.3976 13.5719 17.6014 13ZM15.8264 15.8H14V17.1417C14.6747 16.7879 15.2903 16.3346 15.8264 15.8ZM14.9611 9.72891H18L17.9992 9.72816C17.6348 6.17383 14.8235 3.36391 11.2678 3V6.03775C13.1592 6.35736 14.641 7.83836 14.9611 9.72891Z"
        fill="currentColor"
      />
    </Icon>
  )
}
