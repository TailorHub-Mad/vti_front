import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Accordion, Box, Flex, Text } from "@chakra-ui/react"
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
import { NoteAccordionItem } from "../NoteAccordion/NoteAccordionItem/NoteAccordionItem"

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
  const [activeFormalized, setActiveFormalized] = useState(item.formalized)
  const [activeClose, setActiveClose] = useState(item.isClosed)

  const ownerMessage = item?.owner && item?.owner[0]?._id
  const ownerNote = note?.owner && note?.owner[0]?._id

  const isAdmin = role === RoleType.ADMIN
  const isMyMessage = ownerMessage === userId
  const isMyNote = ownerNote === userId

  const updateLimitDate = isMyMessage ? new Date(item?.updateLimitDate) : null

  const editAllowed =
    (isMyMessage && updateLimitDate ? new Date() < updateLimitDate : null) || isAdmin


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
    await mutate([SWR_CACHE_KEYS.project, fromProjectDetail])
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
          {role === RoleType.ADMIN ? (
            <ActionLink
              onClick={onEdit}
              color="blue.500"
              icon={<EditIcon />}
              label="Editar"
            />
          ) : !isMessage && isMyNote && role === RoleType.USER && editAllowed ? (
            <ActionLink
              onClick={onEdit}
              color="blue.500"
              icon={<EditIcon />}
              label="Editar"
            />
          ) : null}

          {!isMessage && role === RoleType.ADMIN ? (
            <ActionLink
              onClick={() => {
                handleUpdateNote(actionType.CLOSE)
                setActiveClose(!activeClose)
              }}
              color="blue.500"
              icon={
                activeClose ? (
                  <LockCloseIcon color="blue.500" />
                ) : (
                  <LockOpenIcon fill="#C4C4C4" />
                )
              }
              label={activeClose ? "Cerrado" : "Cerrar"}
            />
          ) : !isMessage && isMyNote && role === RoleType.USER ? (
            <ActionLink
              onClick={() => {
                handleUpdateNote(actionType.CLOSE)
                setActiveClose(!activeClose)
              }}
              color="blue.500"
              icon={
                activeClose ? (
                  <LockCloseIcon color="blue.500" />
                ) : (
                  <LockOpenIcon fill="#C4C4C4" />
                )
              }
              label={activeClose ? "Cerrado" : "Cerrar"}
            />
          ) : !isMessage && item.isClosed ? (
            <ActionLink
              onClick={() => {}}
              color="#C4C4C4"
              icon={<LockCloseIcon color="#C4C4C4" />}
              label={"Cerrado"}
              cursor={"default"}
            />
          ) : null}

          {!isMessage && role === RoleType.ADMIN ? (
            <ActionLink
              onClick={() => {
                handleUpdateNote(actionType.FORMALIZED)
                setActiveFormalized(!activeFormalized)
              }}
              color="blue.500"
              icon={
                <FormalizedIcon fill={activeFormalized ? "blue.500" : "#C4C4C4"} />
              }
              label={activeFormalized ? "Formalizado" : "Formalizar"}
            />
          ) : !isMessage && item.formalized ? (
            <ActionLink
              onClick={() => {}}
              color="#C4C4C4"
              icon={<FormalizedIcon fill={"#C4C4C4"} />}
              label={"Formalizado"}
              cursor={"default"}
            />
          ) : null}

          {role === RoleType.ADMIN ||
          (((!isMessage && isMyNote) || (isMessage && isMyMessage)) &&
            role === RoleType.USER &&
            editAllowed) ? (
            <ActionLink
              onClick={onDelete}
              color="error"
              icon={<DeleteIcon />}
              label="Eliminar"
            />
          ) : null}
        </Flex>
      </Flex>

      {isProjectHidden() && !fromProjectDetail && (
        <Box position="relative" w="100%" h="fit-content">
          <Accordion width="100%" allowToggle>
            <NoteAccordionItem
              mt="0"
              title={`Proyecto`}
              icon={<FolderCloseIcon mr="8px" />}
            >
              <Tag variant={variantGeneralTag.PROJECT} width="auto">
                {item.projects[0]?.alias}
              </Tag>
            </NoteAccordionItem>
          </Accordion>
          <GoToButton
            position="absolute"
            right="0"
            top="0"
            label="Ver proyecto"
            onClick={() => router.push(`${PATHS.projects}/${item.projects[0]._id}`)}
          />
        </Box>
      )}
    </>
  )
}
