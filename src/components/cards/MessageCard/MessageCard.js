import { Card } from "../Card"
import { MessageCardFooter } from "./MessageCardFooter/MessageCardFooter"
import { MessageCardHeader } from "./MessageCardHeader/MessageCardHeader"
import { MessageCardInfo } from "./MessageCardInfo/MessageCardInfo"
import { MessageCardTags } from "./MessageCardTags/MessageCardTags"

export const MessageCard = ({
  note,
  onSeeDetails,
  subscribedUsers,
  isSubscribe,
  isFavorite,
  onDelete,
  handleFavorite
}) => {
  return (
    <Card>
      <MessageCardHeader
        isFavorite={isFavorite}
        title={note?.title}
        onClick={onSeeDetails}
        onDelele={onDelete}
        onFavorite={handleFavorite}
      />
      <MessageCardInfo
        id={note?.ref}
        author={note?.clientAlias}
        updatedAt={new Date(note?.updatedAt).toLocaleDateString()}
        marginBottom="18px"
        marginTop="6px"
      />
      <MessageCardTags note={note} />
      <MessageCardFooter
        isClosed={note?.isClosed}
        isSubscribe={isSubscribe}
        isFormalized={note?.formalized}
        messagesCount={note?.messages?.filter((m) => m?.createdAt).length}
        attachmentsCount={note?.documents?.length}
        subscribedUsers={subscribedUsers}
        marginTop="16px"
      />
    </Card>
  )
}
