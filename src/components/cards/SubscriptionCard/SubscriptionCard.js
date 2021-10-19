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
    <Card height="162px">
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
        marginBottom="18px"
        marginTop="6px"
      />
      <SubscriptionCardTags tags={subscription.tags} />
    </Card>
  )
}
