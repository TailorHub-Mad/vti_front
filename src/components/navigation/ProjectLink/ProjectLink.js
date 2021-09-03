import { Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"

export const ProjectLink = ({ alias, children, ...props }) => {
  return (
    <Link href={`/proyectos/${alias}`} passHref>
      <Text cursor="pointer" {...props}>
        {children}
      </Text>
    </Link>
  )
}
