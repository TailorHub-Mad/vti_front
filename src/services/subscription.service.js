import { ServiceConstructor } from "."

const SubscriptionService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD

  const getSubscriptions = (data = "", limit = 0, offset = 0) =>
    execute(instance.get(`/sector?limit=${limit}&offset=${offset}${data}`))
  const getSubscription = (id) => execute(instance.get(`/sector/${id}`))

  // GROUP & FILTER

  const getSearchSubscriptions = (data) =>
    execute(instance.get(`/sector/filter?title=${data}&ref=${data}`))

  return {
    getSubscriptions,
    getSubscription,

    getSearchSubscriptions
  }
}

export default SubscriptionService
