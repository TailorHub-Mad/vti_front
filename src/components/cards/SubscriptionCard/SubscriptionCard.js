import { Card } from "../Card"
import { SubscriptionCardHeader } from "./SubscriptionCardHeader/SubscriptionCardHeader"
import { SubscriptionCardInfo } from "./SubscriptionCardInfo/SubscriptionCardInfo"
import { SubscriptionCardTags } from "./SubscriptionCardTags/SubscriptionCardTags"

export const SubscriptionCard = ({
  subscription,
  onClick,
  onDelete,
  onCardSelected,
  isChecked
}) => {
  return (
    <Card maxHeight="148px">
      <SubscriptionCardHeader
        title={subscription?.title}
        onClick={onClick}
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
