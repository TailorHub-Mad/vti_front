import { useDisclosure } from "@chakra-ui/react"
import { NoteDrawer } from "../../drawer/NoteDrawer/NoteDrawer"
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
  ...props
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <Card bgColor="white" {...props}>
      <NoteDrawer isOpen={isOpen} onClose={() => onClose()} />
      <MessageCardHeader isFavourite={isFavourite} title={title} onClick={onOpen} />
      <MessageCardInfo
        id={id}
        author={author}
        updatedAt={updatedAt.toLocaleDateString()}
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
