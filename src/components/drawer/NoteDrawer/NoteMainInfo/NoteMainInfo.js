import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { useSWRConfig } from "swr"
import useNoteApi from "../../../../hooks/api/useNoteApi"
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

export const NoteMainInfo = ({ item, onEdit, onDelete, isMessage = false }) => {
  const { updateNote } = useNoteApi()
  const { mutate } = useSWRConfig()

  const handleUpdateNote = async (action) => {
    // TODO -> update states message
    if (isMessage) return

    switch (action) {
      case actionType.CLOSE:
        await updateNote(item._id, { isClosed: !item.isClosed })
        break

      case actionType.FORMALIZED:
        await updateNote(item._id, { formalized: !item.formalized })
        break

      default:
        return null
    }

    await mutate(SWR_CACHE_KEYS.notes)
  }

  const handleGoToProject = () => {
    // TODO handle go to project detail
    console.log("GO_PROJECT", item.project)
  }

  return (
    <>
      <Flex justify="space-between" h="16px">
        <Text variant="d_xs_regular" color="grey">
          {new Date(item.updatedAt)?.toLocaleDateString()}
        </Text>
        <Flex>
          {isMessage || (
            <ActionLink
              onClick={onEdit}
              color="grey"
              icon={<EditIcon />}
              label="Editar"
            />
          )}

          <ActionLink
            onClick={() => handleUpdateNote(actionType.CLOSE)}
            color={item.isClosed ? "blue.500" : "#C9C9C9"}
            icon={
              item.isClosed ? <LockCloseIcon /> : <LockOpenIcon fill="#C9C9C9" />
            }
            label={item.isClosed ? "Cerrado" : "Cerrar"}
          />

          <ActionLink
            onClick={() => handleUpdateNote(actionType.FORMALIZED)}
            color={item.formalized ? "#0085FF" : "#C9C9C9"}
            icon={<FormalizedIcon fill={item.formalized ? "#0085FF" : "#C9C9C9"} />}
            label={item.formalized ? "Formalizado" : "Formalizar"}
          />

          {isMessage || (
            <ActionLink
              onClick={onDelete}
              color="error"
              icon={<DeleteIcon />}
              label="Eliminar"
            />
          )}
        </Flex>
      </Flex>

      {isMessage || !item.project || (
        <Box mt="24px">
          <Flex justify="space-between">
            <Flex align="center">
              <FolderCloseIcon mr="8px" />
              <Text variant="d_s_medium" mt="4px">
                Proyectos
              </Text>
            </Flex>
            <GoToButton label="Ver proyecto" onClick={handleGoToProject} />
          </Flex>

          <Tag variant={variantGeneralTag.PROJECT} mt="8px" ml="32px">
            {item.project?.alias}
          </Tag>
        </Box>
      )}
    </>
  )
}
