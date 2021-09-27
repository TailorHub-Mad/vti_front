import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { useSWRConfig } from "swr"
import useNoteApi from "../../../../hooks/api/useNoteApi"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { ActionLink } from "../../../buttons/ActionLink/ActionLink"
import { GoToButton } from "../../../buttons/GoToButton/GoToButton"
import { FolderCloseIcon } from "../../../icons/FolderCloseIcon"
import { FormalizedIcon } from "../../../icons/FormalizedIcon"
import { LockCloseIcon } from "../../../icons/LockCloseIcon"
import { LockOpenIcon } from "../../../icons/LockOpenIcon"
import { ProjectTag } from "../../../tags/ProjectTag/ProjectTag"

const actionType = {
  CLOSE: "close",
  FORMALIZED: "formalized"
}

export const NoteMainInfo = ({ note, updatedAt, onEdit, onDelete, isResponse }) => {
  const { updateNote } = useNoteApi()
  const { mutate } = useSWRConfig()

  const [closed, setClosed] = useState(note?.isClosed)
  const [fomalized, setFomalized] = useState(note?.fomalized)

  const handleUpdateNote = async (action) => {
    switch (action) {
      case actionType.CLOSE:
        setClosed(!closed)
        await updateNote(note?._id, { isClosed: !closed })
        break

      case actionType.FORMALIZED:
        setFomalized(!fomalized)
        await updateNote(note?._id, { formalized: !fomalized })
        break

      default:
        return null
    }

    await mutate(SWR_CACHE_KEYS.notes)
  }

  const handleGoToProject = () => {
    // TODO handle go to project detail
    console.log("GO_PROJECT", note?.project)
  }

  return (
    <>
      <Flex justify="space-between" h="16px">
        <Text variant="d_xs_regular" color="grey">
          {new Date(updatedAt)?.toLocaleDateString()}
        </Text>
        <Flex>
          <ActionLink
            onClick={onEdit}
            color="grey"
            icon={<EditIcon />}
            label="Editar"
          />

          <ActionLink
            onClick={() => handleUpdateNote(actionType.CLOSE)}
            color={closed ? "blue.500" : "#C9C9C9"}
            icon={closed ? <LockCloseIcon /> : <LockOpenIcon fill="#C9C9C9" />}
            label={closed ? "Cerrado" : "Cerrar"}
          />

          <ActionLink
            onClick={() => handleUpdateNote(actionType.FORMALIZED)}
            color={fomalized ? "#0085FF" : "#C9C9C9"}
            icon={<FormalizedIcon fill={fomalized ? "#0085FF" : "#C9C9C9"} />}
            label={fomalized ? "Formalizado" : "Formalizar"}
          />

          <ActionLink
            onClick={onDelete}
            color="error"
            icon={<DeleteIcon />}
            label="Eliminar"
          />
        </Flex>
      </Flex>

      {!isResponse && (
        <Box mt="24px">
          <Flex justify="space-between">
            <Flex align="center">
              <FolderCloseIcon mr="8px" />
              <Text variant="d_s_medium" mt="4px">
                Proyecto
              </Text>
            </Flex>
            <GoToButton label="Ver proyecto" onClick={handleGoToProject} />
          </Flex>
          <ProjectTag mt="8px" ml="32px">
            {/* // TODO -> detail project */}
          </ProjectTag>
        </Box>
      )}
    </>
  )
}
