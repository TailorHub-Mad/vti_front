import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useContext } from "react"
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
  note
}) => {
  const router = useRouter()
  const { updateNote, updateMessage } = useNoteApi()
  const { mutate } = useSWRConfig()
  const { role, user } = useContext(ApiAuthContext)

  const { _id } = user
  const ownerMessage = item?.owner && item?.owner[0]?._id

  const isMyMessage = ownerMessage === _id

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

    await mutate(SWR_CACHE_KEYS.notes)
  }

  const isProjectHidden = () => {
    if (isMessage) return false

    const { projects } = item

    if (!projects) return false

    return true
  }

  return (
    <>
      <Flex justify="space-between" h="16px">
        <Text variant="d_xs_regular" color="grey">
          {new Date(item.updatedAt)?.toLocaleDateString()}
        </Text>
        <Flex>
          {!isMessage || isMyMessage ? (
            <>
              {!isMessage ? (
                <ActionLink
                  onClick={onEdit}
                  color="grey"
                  icon={<EditIcon />}
                  label="Editar"
                />
              ) : null}

              {isMessage && editAllowed ? (
                <ActionLink
                  onClick={onEdit}
                  color="grey"
                  icon={<EditIcon />}
                  label="Editar"
                />
              ) : null}

              <ActionLink
                onClick={() => handleUpdateNote(actionType.CLOSE)}
                color={item.isClosed ? "blue.500" : "#C9C9C9"}
                icon={
                  item.isClosed ? <LockCloseIcon /> : <LockOpenIcon fill="#C9C9C9" />
                }
                label={item.isClosed ? "Cerrado" : "Cerrar"}
              />

              {role === RoleType.USER && isMessage ? null : (
                <>
                  <ActionLink
                    onClick={() => handleUpdateNote(actionType.FORMALIZED)}
                    color={item.formalized ? "#0085FF" : "#C9C9C9"}
                    icon={
                      <FormalizedIcon
                        fill={item.formalized ? "#0085FF" : "#C9C9C9"}
                      />
                    }
                    label={item.formalized ? "Formalizado" : "Formalizar"}
                  />

                  <ActionLink
                    onClick={onDelete}
                    color="error"
                    icon={<DeleteIcon />}
                    label="Eliminar"
                  />
                </>
              )}
            </>
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

          <Tag variant={variantGeneralTag.PROJECT} mt="8px" ml="32px">
            {item.projects[0]?.alias}
          </Tag>
        </Box>
      )}
    </>
  )
}
