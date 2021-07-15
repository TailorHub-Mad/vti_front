import { Card } from "../../layout/Card/Card"
import { MessageCardFooter } from "./MessageCardFooter/MessageCardFooter"
import { MessageCardHeader } from "./MessageCardHeader/MessageCardHeader"
import { MessageCardInfo } from "./MessageCardInfo/MessageCardInfo"
import { MessageCardTags } from "./MessageCardTags/MessageCardTags"

export const MessageCard = ({
  id = "ID001",
  author = "Autor muy largo con nombre gigante",
  title = "Projecto M0 título",
  isFavourite = true,
  isClosed = true,
  isUnread = true,
  canSubscribe = false,
  messagesCount,
  attachmentsCount,
  subscribedUsers = ["PL", "", ""],
  tags = {
    project_tags: ["Hola", "Que ase", "Gracias"],
    test_system_tags: ["Hola", "Que ase", "Gracias"],
    notes_tags: ["Hola", "Que ase", "Gracias"],
  },
  updatedAt = "15/02/2021",
  ...props
}) => {
  return (
    <Card {...props}>
      <MessageCardHeader isFavourite={isFavourite} title={title} />
      <MessageCardInfo
        id={id}
        author={author}
        updatedAt={updatedAt}
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
