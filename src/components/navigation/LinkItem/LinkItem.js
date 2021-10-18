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

export const LinkItemSpan = ({ url = "", children, ...props }) => {
  return (
    <Link href={url} passHref {...props}>
      <Text display="inline" cursor="pointer" {...props}>
        {children}
      </Text>
    </Link>
  )
}
