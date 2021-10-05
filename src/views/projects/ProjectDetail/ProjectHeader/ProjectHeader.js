import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Flex, Text } from "@chakra-ui/react"
import Link from "next/link"
import React from "react"
import { ActionLink } from "../../../../components/buttons/ActionLink/ActionLink"
import { ArrowRightIcon } from "../../../../components/icons/ArrowRightIcon"
import { FinishIcon } from "../../../../components/icons/FinishIcon"
import { PageHeader } from "../../../../components/layout/Pages/PageHeader/PageHeader"
import { PATHS } from "../../../../utils/constants/global"

export const ProjectHeader = ({
  idProject,
  onEdit,
  onClose,
  onDelete,
  isClosed
}) => {
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
        <ActionLink onClick={onEdit} label="Editar" icon={<EditIcon />} />
        <ActionLink
          onClick={onClose}
          label={isClosed ? "Finalizado" : "Finalizar"}
          color={isClosed ? "green" : "start"}
          icon={<FinishIcon />}
        />
        <ActionLink
          onClick={onDelete}
          label="Eliminar"
          color="error"
          icon={<DeleteIcon />}
        />
      </Flex>
    </PageHeader>
  )
}
