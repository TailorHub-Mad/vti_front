import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Flex, Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"
import { ActionLink } from "../../../../components/buttons/ActionLink/ActionLink"
import { ArrowRightIcon } from "../../../../components/icons/ArrowRightIcon"
import { FinishIcon } from "../../../../components/icons/FinishIcon"
import { PageHeader } from "../../../../components/layout/Pages/PageHeader/PageHeader"
import { PATHS } from "../../../../utils/constants/paths"

export const ProjectHeader = ({ idProject }) => {
  //TODO Conectar las acciones con la main page

  return (
    <PageHeader mb="0">
      <Flex>
        <Link href={PATHS.projects} passHref>
          <Text variant="d_l_medium" color="blue.400" cursor="pointer">
            Proyectos
          </Text>
        </Link>
        <ArrowRightIcon />
        <Text variant="d_l_medium">{idProject}</Text>
      </Flex>
      <Flex>
        <ActionLink label="Editar" isDisabled icon={<EditIcon />} />
        <ActionLink label="Finalizar" color="start" icon={<FinishIcon />} />
        <ActionLink label="Eliminar" color="error" icon={<DeleteIcon />} />
      </Flex>
    </PageHeader>
  )
}
