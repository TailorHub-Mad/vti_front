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
  handleDelete,
  handleFavorite
}) => {
  const handleOnFavorite = () => {
    if (isFavorite) return
    handleFavorite()
  }

  return (
    <Card bgColor="white">
      <MessageCardHeader
        isFavorite={isFavorite}
        title={note?.title}
        onClick={onSeeDetails}
        onDelele={handleDelete}
        onFavorite={handleOnFavorite}
      />
      <MessageCardInfo
        id={note?._id}
        author={note?.owner}
        updatedAt={new Date(note?.updatedAt).toLocaleDateString()}
        marginBottom="18px"
        marginTop="6px"
      />
      <MessageCardTags tags={note?.tags} />
      <MessageCardFooter
        isClosed={note?.lock}
        isSubscribe={isSubscribe}
        isValidate={note?.approved}
        messagesCount={note?.messages?.length}
        attachmentsCount={note?.documents?.length}
        subscribedUsers={subscribedUsers}
        marginTop="16px"
      />
    </Card>
  )
}
