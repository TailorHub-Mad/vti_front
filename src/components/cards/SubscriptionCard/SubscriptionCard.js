import { useRouter } from "next/router"
import { Card } from "../Card"
import { SubscriptionCardHeader } from "./SubscriptionCardHeader/SubscriptionCardHeader"
import { SubscriptionCardInfo } from "./SubscriptionCardInfo/SubscriptionCardInfo"
import { SubscriptionCardTags } from "./SubscriptionCardTags/SubscriptionCardTags"

export const SubscriptionCard = ({
  subscription,
  onDelete,
  owner,
  onCardSelected,
  isChecked,
  currentState
}) => {
  const router = useRouter()

  const isClickable = subscription?.tags.length > 0

  return (
    <Card maxHeight="148px">
      <SubscriptionCardHeader
        title={subscription?.title}
        onClick={() =>
          isClickable
            ? router.push(
                `${router.query.id}/${subscription._id}?owner=${owner}&type=${currentState}`
              )
            : null
        }
        onDelele={onDelete}
        onCardSelected={onCardSelected}
        checked={isChecked}
        isClickable={isClickable}
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
