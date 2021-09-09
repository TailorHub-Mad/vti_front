import { Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import React from "react"
import { capitalize } from "../../../utils/functions/common"
import { ArrowRight } from "../../icons/ArrowRight"

export const BreadCrumbs = ({ lastText }) => {
  const router = useRouter()
  const items = router.asPath
    .split("/")
    .filter((el) => el)
    .map((el) => capitalize(el))
  lastText && items.push(lastText)

  const generateUrl = (lastIdx) => {
    const url = router.asPath
      .split("/")
      .filter((el) => el)
      .splice(0, lastIdx + 1)
      .join("/")
    return `/${url}`
  }

  return (
    <Flex alignItems="center">
      {items.map((navItem, idx) => {
        const key = `${navItem}-${idx}`
        return (
          <div key={key}>
            {idx > 0 && idx < items.length && <ArrowRight />}
            {idx === items.length - 1 ? (
              <Text variant="d_l_medium" color="blue.500" mt="4px" as="a">
                {navItem}
              </Text>
            ) : (
              <Link passHref href={generateUrl(idx)}>
                <Text variant="d_l_medium" color="blue.400" mt="4px" as="a">
                  {navItem}
                </Text>
              </Link>
            )}
          </div>
        )
      })}
    </Flex>
  )
}
