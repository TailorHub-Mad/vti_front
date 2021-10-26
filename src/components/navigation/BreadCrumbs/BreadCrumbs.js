import { Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Link from "next/link"
import React from "react"
import { capitalize } from "../../../utils/functions/global"
import { ArrowRight } from "../../icons/ArrowRight"

export const BreadCrumbs = ({ customURL, lastElement }) => {
  const router = useRouter()

  const splitURL = (url) => {
    return url
      .split("/")
      .filter((el) => el)
      .map((el) => capitalize(el))
  }

  const generateUrl = (lastIdx) => {
    const url = router.asPath
      .split("/")
      .filter((el) => el)
      .splice(0, lastIdx + 1)
      .join("/")
    return `/${url}`
  }

  const items = splitURL(customURL ?? router.asPath)

  lastElement && items.push(...splitURL(lastElement))

  return (
    <Flex alignItems="center" justifyContent="center">
      {items.map((navItem, idx) => {
        const key = `${navItem}-${idx}`
        const href = generateUrl(idx)
        const lock = href.localeCompare(router.asPath)
        return (
          <div key={key}>
            {idx > 0 && idx < items.length && <ArrowRight pb="5px" />}
            {idx === items.length - 1 ? (
              <Text variant="d_l_medium" color="blue.500" as="a" cursor="default">
                {navItem}
              </Text>
            ) : (
              <Link passHref href={href}>
                <Text
                  variant="d_l_medium"
                  color="blue.400"
                  as="a"
                  cursor={lock ? "pointer" : "default"}
                  _hover={{ color: "blue.500" }}
                >
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
