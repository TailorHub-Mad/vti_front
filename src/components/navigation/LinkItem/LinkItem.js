import { Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

export const LinkItem = ({ url = "", children, ...props }) => {
  return (
    <Link href={url} passHref>
      <Text cursor="pointer" {...props}>
        {children}
      </Text>
    </Link>
  )
}
