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
  fromProjectDetail
}) => {
  const setOwners = new Set(
    note?.messages.map((m) => {
      return m.owner[0]?.alias
    })
  )
  const owners = Array.from(setOwners).filter((e) => e)

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
      />
      <MessageCardInfo
        id={note?.ref}
        author={note?.clientAlias}
        updatedAt={new Date(note?.updatedAt).toLocaleDateString()}
        marginBottom="18px"
        marginTop="6px"
      />
      <MessageCardTags note={note} fromProjectDetail={fromProjectDetail} />
      <MessageCardFooter
        isClosed={note?.isClosed}
        isSubscribe={isSubscribe}
        isFormalized={note?.formalized}
        messagesCount={note?.messages?.filter((m) => m?.createdAt).length}
        attachmentsCount={note?.documents?.length}
        subscribedUsers={owners.length > 0 ? owners : null}
        marginTop="16px"
      />
    </Card>
  )
}
