import { Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

export const DepartmentLink = ({ alias, children, ...props }) => {
  return (
    <Link href={`/departamentos/${alias}`} passHref>
      <Text cursor="pointer" {...props}>
        {children}
      </Text>
    </Link>
  )
}
