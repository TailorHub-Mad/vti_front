import { Icon } from "@chakra-ui/react"
import React from "react"

export const FormalizedIcon = (props) => {
  return (
    <Icon
      width="25px"
      height="24px"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.58268 10.3346L3.58935 3.0013C3.58934 2.26752 4.18224 1.67164 4.91602 1.66797L11.5827 1.66797C12.3165 1.67164 12.9094 2.26752 12.9093 3.0013L12.916 10.3346C12.9162 10.7661 12.7075 11.171 12.356 11.4213L8.24935 14.3346L4.14268 11.4213C3.79118 11.171 3.58252 10.7661 3.58268 10.3346ZM11.5827 10.3346L4.91602 10.3346L8.58268 10.3346H11.5827Z"
        fill={props.fill ?? "#0085FF"}
      />
    </Icon>
  )
}
