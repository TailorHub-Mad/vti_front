import { Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

export const ClientLink = ({ alias, children, ...props }) => {
  return (
    <Link href={`/clientes/${alias}`} passHref>
      <Text cursor="pointer" {...props}>
        {children}
      </Text>
    </Link>
  )
}
