import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import useNoteApi from "../../../../hooks/api/useNoteApi"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { PATHS, RoleType } from "../../../../utils/constants/global"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { variantGeneralTag } from "../../../../utils/constants/tabs"
import { ActionLink } from "../../../buttons/ActionLink/ActionLink"
import { GoToButton } from "../../../buttons/GoToButton/GoToButton"
import { FolderCloseIcon } from "../../../icons/FolderCloseIcon"
import { FormalizedIcon } from "../../../icons/FormalizedIcon"
import { LockCloseIcon } from "../../../icons/LockCloseIcon"
import { LockOpenIcon } from "../../../icons/LockOpenIcon"
import { Tag } from "../../../tags/Tag/Tag"

const actionType = {
  CLOSE: "close",
  FORMALIZED: "formalized"
}

export const NoteMainInfo = ({
  item,
  onEdit,
  onDelete,
  isMessage = false,
  fromProjectDetail,
  note
}) => {
  const router = useRouter()
  const { updateNote, updateMessage } = useNoteApi()
  const { mutate } = useSWRConfig()
  const { role, user } = useContext(ApiAuthContext)

  const [userId, setUserId] = useState()

  const ownerMessage = item?.owner && item?.owner[0]?._id
  const ownerNote = note?.owner && note?.owner[0]?._id

  const isMyMessage = ownerMessage === userId
  const isMyNote = ownerNote === userId

  const updateLimitDate = isMyMessage ? item?.updateLimitDate : null
  const editAllowed = updateLimitDate ? new Date() < new Date(updateLimitDate) : null

  const handleUpdateNote = async (action) => {
    switch (action) {
      case actionType.CLOSE: {
        isMessage
          ? await updateMessage(note._id, item._id, { approved: !item.approved })
          : await updateNote(item._id, { isClosed: !item.isClosed })

        break
      }

      case actionType.FORMALIZED: {
        const data = { formalized: !item.formalized }
        isMessage
          ? await updateMessage(note._id, item._id, data)
          : await updateNote(item._id, data)
        break
      }

      default:
        return null
    }

    fromProjectDetail
      ? await mutate([SWR_CACHE_KEYS.project, fromProjectDetail])
      : await mutate(SWR_CACHE_KEYS.notes)
  }

  const isProjectHidden = () => {
    if (isMessage) return false

    const { projects } = item

    if (!projects) return false

    return true
  }

  useEffect(() => {
    setUserId(user?._id)
  }, [user])

  return (
    <>
      <Flex justify="space-between" h="16px">
        <Text variant="d_xs_regular" color="grey">
          {new Date(item.updatedAt)?.toLocaleDateString()}
        </Text>
        <Flex>
          {!isMessage && role === RoleType.ADMIN ? (
            <ActionLink
              onClick={onEdit}
              color="blue.500"
              icon={<EditIcon />}
              label="Editar"
            />
          ) : !isMessage && role === RoleType.USER && isMyNote ? (
            <ActionLink
              onClick={onEdit}
              color="blue.500"
              icon={<EditIcon />}
              label="Editar"
            />
          ) : isMessage && isMyMessage && role === RoleType.ADMIN ? (
            <ActionLink
              onClick={onEdit}
              color="blue.500"
              icon={<EditIcon />}
              label="Editar"
            />
          ) : isMessage && isMyMessage && role === RoleType.ADMIN && editAllowed ? (
            <ActionLink
              onClick={onEdit}
              color="blue.500"
              icon={<EditIcon />}
              label="Editar"
            />
          ) : null}

          {role === RoleType.ADMIN ? (
            <ActionLink
              onClick={() => handleUpdateNote(actionType.CLOSE)}
              color="blue.500"
              icon={
                item.isClosed ? (
                  <LockCloseIcon color="blue.500" />
                ) : (
                  <LockOpenIcon fill="#C4C4C4" />
                )
              }
              label={item.isClosed ? "Cerrado" : "Cerrar"}
            />
          ) : item.isClosed ? (
            <ActionLink
              onClick={() => {}}
              color="blue.500"
              icon={<LockCloseIcon color="blue.500" />}
              label={"Cerrado"}
              cursor={"default"}
            />
          ) : null}

          {role === RoleType.ADMIN ? (
            <ActionLink
              onClick={() => {
                handleUpdateNote(actionType.FORMALIZED)
              }}
              color="blue.500"
              icon={
                <FormalizedIcon fill={item.formalized ? "blue.500" : "#C4C4C4"} />
              }
              label={item.formalized ? "Formalizado" : "Formalizar"}
            />
          ) : item.formalized ? (
            <ActionLink
              onClick={() => {}}
              color="blue.500"
              icon={<FormalizedIcon fill={"blue.500"} />}
              label={"Formalizado"}
              cursor={"default"}
            />
          ) : null}

          {!isMessage && role === RoleType.ADMIN ? (
            <ActionLink
              onClick={onDelete}
              color="error"
              icon={<DeleteIcon />}
              label="Eliminar"
            />
          ) : isMessage && isMyMessage && role === RoleType.USER ? (
            <ActionLink
              onClick={onDelete}
              color="error"
              icon={<DeleteIcon />}
              label="Eliminar"
            />
          ) : isMyMessage ? (
            <ActionLink
              onClick={onDelete}
              color="error"
              icon={<DeleteIcon />}
              label="Eliminar"
            />
          ) : null}
        </Flex>
      </Flex>

      {isProjectHidden() && (
        <Box mt="24px">
          <Flex justify="space-between">
            <Flex align="center">
              <FolderCloseIcon mr="8px" />
              <Text variant="d_s_medium" mt="4px">
                Proyectos
              </Text>
            </Flex>
            <GoToButton
              label="Ver proyecto"
              onClick={() =>
                router.push(`${PATHS.projects}/${item.projects[0]._id}`)
              }
            />
          </Flex>

          <Tag variant={variantGeneralTag.PROJECT} mt="8px" ml="32px" width="auto">
            {item.projects[0]?.alias}
          </Tag>
        </Box>
      )}
    </>
  )
}
