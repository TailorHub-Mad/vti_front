import SubscriptionService from "../../services/subscription.service"

const useSubscriptionApi = () => {
  const subscriptionService = SubscriptionService()

  // CRUD
  const getSubscriptions = (_, data) => subscriptionService.getSubscriptions(data)
  const getSubscription = (_, id) => subscriptionService.getSubscription(id)
  const createSubscription = (data) => subscriptionService.createSubscription(data)
  const updateSubscription = (id, data) =>
    subscriptionService.updateSubscription(id, data)
  const deleteSubscription = (id) => subscriptionService.deleteSubscription(id)

  // GROUP & FILTER
  const getSearchSubscriptions = (_, { data, search }) =>
    subscriptionService.getSearchSubscriptions(data, search)

  return {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,

    getSearchSubscriptions
  }
}

export default useSubscriptionApi
