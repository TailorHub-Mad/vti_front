import { Text } from "@chakra-ui/layout"
import { useContext, useEffect, useState } from "react"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global"
import { Card } from "../Card"
import { MessageCardFooter } from "./MessageCardFooter/MessageCardFooter"
import { MessageCardHeader } from "./MessageCardHeader/MessageCardHeader"
import { MessageCardInfo } from "./MessageCardInfo/MessageCardInfo"
import { MessageCardTags } from "./MessageCardTags/MessageCardTags"

export const MessageCard = ({
  note,
  onSeeDetails,
  isSubscribe,
  isFavorite,
  onDelete,
  handleFavorite,
  handleSubscribe,
  fromProjectDetail,
  notesFromSubscription
}) => {
  const [isRead, setIsRead] = useState(false)
  const [userId, setUserId] = useState()

  const { user, role } = useContext(ApiAuthContext)

  // Note owner
  const ownerNote = note?.owner && Array.isArray(note.owner) && note.owner[0]
  const isMyNote = ownerNote?._id === userId

  // Messages owners
  const ownersMessages = note?.messages
    ?.map((m) => {
      return Array.isArray(m.owner) ? m.owner[0]?.alias : undefined
    })
    .filter((e) => e)
  const setOwners = new Set()

  // Notes participants
  setOwners.add(ownerNote?.alias)
  ownersMessages.forEach((e) => setOwners.add(e))
  const owners = Array.from(setOwners).filter((e) => e)

  const updateLimitDate = isMyNote ? note?.updateLimitDate : null
  const editAllowed = updateLimitDate ? new Date() < new Date(updateLimitDate) : null

  useEffect(() => {
    if (!note?.readBy) return

    const found = note.readBy.find((id) => {
      return user?._id === id
    })

    setIsRead(found)
  }, [user, note])

  useEffect(() => {
    setUserId(user?._id)
  }, [user])

  const getAttachmentNum = () => {
    const num =
      note?.documents?.length +
      note?.messages?.reduce((acc, val) => {
        const newAcc = val.documents?.length + acc
        return newAcc
      }, 0)

    return num || 0
  }

  return (
    <Card>
      <MessageCardHeader
        isFavorite={isFavorite}
        title={note?.title}
        onClick={onSeeDetails}
        isSubscribe={isSubscribe}
        onDelele={onDelete}
        onFavorite={handleFavorite}
        onSubscribe={handleSubscribe}
        notesFromSubscription={notesFromSubscription}
      />
      <MessageCardInfo
        id={note?.ref}
        isAdmin={RoleType.ADMIN === role}
        author={Array.isArray(note?.owner) ? note?.owner[0]?.alias : ""}
        updatedAt={new Date(note?.updatedAt).toLocaleDateString()}
        marginBottom="18px"
        marginTop="6px"
      />
      <MessageCardTags note={note} fromProjectDetail={fromProjectDetail} />

      {isMyNote && editAllowed ? (
        <Text variant="d_s_regular" color="error" m={0} mt="24px">
          No publicado
        </Text>
      ) : (
        <MessageCardFooter
          isClosed={note?.isClosed}
          isSubscribe={isSubscribe}
          isFormalized={note?.formalized}
          messagesCount={note?.messages?.filter((m) => m?.message).length}
          attachmentsCount={getAttachmentNum()}
          subscribedUsers={owners.length > 0 ? owners : null}
          isRead={isRead}
          marginTop="16px"
        />
      )}
    </Card>
  )
}
