import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Flex, Text } from "@chakra-ui/react"
import Link from "next/link"
import React, { useContext } from "react"
import { ActionLink } from "../../../../components/buttons/ActionLink/ActionLink"
import { ArrowRightIcon } from "../../../../components/icons/ArrowRightIcon"
import { FinishIcon } from "../../../../components/icons/FinishIcon"
import { HeartIcon } from "../../../../components/icons/HeartIcon"
import { SubscribeIcon } from "../../../../components/icons/SubscribeIcon"
import { PageHeader } from "../../../../components/layout/Pages/PageHeader/PageHeader"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { PATHS, RoleType } from "../../../../utils/constants/global"

export const ProjectHeader = ({
  idProject,
  onEdit,
  onClose,
  onDelete,
  isClosed,
  onSubscribe,
  onFavorite,
  isSubscribe,
  isFavorite
}) => {
  const { role } = useContext(ApiAuthContext)

  return (
    <PageHeader
      flexDirection={["column", null, null, "row"]}
      align={["flex-start", null, null, "center"]}
      mb={["32px", null, null, "0"]}
    >
      <Flex>
        <Link href={PATHS.projects} passHref>
          <Text variant="d_l_medium" color="blue.400" cursor="pointer">
            Proyectos
          </Text>
        </Link>
        <ArrowRightIcon />
        <Text variant="d_l_medium">{idProject}</Text>
      </Flex>
      <Flex mt={["16px", null, null, null]}>
        <ActionLink
          onClick={() => onSubscribe(isSubscribe)}
          label={isSubscribe ? "Darme de baja" : "Suscribirme"}
          color={isSubscribe ? "error" : "Sblue.500"}
          icon={<SubscribeIcon color={isSubscribe ? "error" : "blue.500"} />}
          ml={["0", null, null, null]}
        />
        {role === RoleType.USER ? (
          <ActionLink
            onClick={() => onFavorite(isFavorite)}
            label={isFavorite ? "Eliminar favorito" : "Añadir Favorito"}
            icon={<HeartIcon />}
          />
        ) : null}

        {role === RoleType.ADMIN ? (
          <ActionLink onClick={onEdit} label="Editar" icon={<EditIcon />} />
        ) : null}

        {role === RoleType.ADMIN ? (
          <ActionLink
            onClick={onClose}
            label={isClosed ? "Finalizado" : "Finalizar"}
            color={isClosed ? "green" : "start"}
            icon={<FinishIcon />}
          />
        ) : isClosed ? (
          <ActionLink
            onClick={() => {}}
            label={"Finalizado"}
            color={"green"}
            icon={<FinishIcon />}
            cursor={"default"}
          />
        ) : null}

        {role === RoleType.ADMIN ? (
          <ActionLink
            onClick={onDelete}
            label="Eliminar"
            color="error"
            icon={<DeleteIcon />}
          />
        ) : null}
      </Flex>
    </PageHeader>
  )
}
