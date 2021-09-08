import { Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

export const SectorLink = ({ alias, children, ...props }) => {
  return (
    <Link href={`/sectores/${alias}`} passHref>
      <Text cursor="pointer" {...props}>
        {children}
      </Text>
    </Link>
  )
}
