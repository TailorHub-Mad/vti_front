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
  isFavourite,
}) => {
  return (
    <Card bgColor="white">
      <MessageCardHeader
        isFavourite={isFavourite}
        title={note.title}
        onClick={onSeeDetails}
      />
      <MessageCardInfo
        id={note._id}
        author={note.owner}
        updatedAt={new Date(note.updatedAt).toLocaleDateString()}
        marginBottom="18px"
        marginTop="6px"
      />
      <MessageCardTags tags={note.tags} />
      <MessageCardFooter
        isClosed={note.approved} // TODO -> change API (approved -> close/lock)
        isSubscribe={isSubscribe}
        onLock={() => {}}
        onUnlock={() => {}}
        onSubscribe={() => {}}
        onValidate={() => {}}
        seeMessages={() => {}}
        seeAttachments={() => {}}
        messagesCount={note.messages?.length}
        attachmentsCount={note.documents?.length}
        subscribedUsers={subscribedUsers}
        marginTop="16px"
      />
    </Card>
  )
}
