import { useRouter } from "next/router"
import { Card } from "../Card"
import { SubscriptionCardHeader } from "./SubscriptionCardHeader/SubscriptionCardHeader"
import { SubscriptionCardInfo } from "./SubscriptionCardInfo/SubscriptionCardInfo"
import { SubscriptionCardTags } from "./SubscriptionCardTags/SubscriptionCardTags"

export const SubscriptionCard = ({
  subscription,
  onDelete,
  onCardSelected,
  isChecked
}) => {
  const router = useRouter()

  return (
    <Card maxHeight="148px">
      <SubscriptionCardHeader
        title={subscription?.title}
        onClick={() => router.push(`${subscription._id}/apuntes`)}
        onDelele={onDelete}
        onCardSelected={onCardSelected}
        checked={isChecked}
      />
      <SubscriptionCardInfo
        client={subscription?.client}
        updatedAt={new Date(subscription?.updatedAt).toLocaleDateString()}
        marginTop="6px"
      />
      <SubscriptionCardTags pb="16px" tags={subscription.tags} />
    </Card>
  )
}
