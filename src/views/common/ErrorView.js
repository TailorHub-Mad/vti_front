import { Flex, Text, Button } from "@chakra-ui/react"
import React from "react"
import Link from "next/link"
import { PATHS } from "../../utils/constants/global"
import { Page } from "../../components/layout/Pages/Page"

export const ErrorView = ({ ...props }) => {
  return (
    <Page>
      <Flex
        mt="200px"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        {...props}
      >
        <Text variant="d_l_medium" mb="50px">
          Ha ocurrido un error
        </Text>
        <Link href={PATHS.root} passHref>
          <Button>Volver al inicio</Button>
        </Link>
      </Flex>
    </Page>
  )
}
