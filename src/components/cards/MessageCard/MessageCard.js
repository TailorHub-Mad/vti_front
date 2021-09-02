import { Card } from "../../layout/Card/Card"
import { MessageCardFooter } from "./MessageCardFooter/MessageCardFooter"
import { MessageCardHeader } from "./MessageCardHeader/MessageCardHeader"
import { MessageCardInfo } from "./MessageCardInfo/MessageCardInfo"
import { MessageCardTags } from "./MessageCardTags/MessageCardTags"

export const MessageCard = ({
  id,
  messagesCount,
  attachmentsCount,
  subscribedUsers,
  isFavourite,
  title,
  author,
  updatedAt,
  tags,
  isClosed,
  canSubscribe,
  onSeeDetails,
  ...props
}) => {
  return (
    <Card bgColor="white" {...props}>
      <MessageCardHeader
        isFavourite={isFavourite}
        title={title}
        onClick={onSeeDetails}
      />
      <MessageCardInfo
        id={id}
        author={author}
        updatedAt={updatedAt?.toLocaleDateString()}
        marginBottom="18px"
        marginTop="6px"
      />
      <MessageCardTags tags={tags} />
      <MessageCardFooter
        isClosed={isClosed}
        canSubscribe={canSubscribe}
        onLock={() => {}}
        onUnlock={() => {}}
        onSubscribe={() => {}}
        onValidate={() => {}}
        seeMessages={() => {}}
        seeAttachments={() => {}}
        messagesCount={messagesCount}
        attachmentsCount={attachmentsCount}
        subscribedUsers={subscribedUsers}
        marginTop="16px"
      />
    </Card>
  )
}
