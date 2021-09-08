import { Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

export const TestSystemLink = ({ children, ...props }) => {
  return (
    <Link href={``} passHref>
      <Text cursor="pointer" {...props}>
        {children}
      </Text>
    </Link>
  )
}
