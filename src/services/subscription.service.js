import { ServiceConstructor } from "."

const SubscriptionService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD

  const getSubscriptions = (data = "", limit = 0, offset = 0) =>
    execute(instance.get(`/subscribed/${data}?limit=${limit}&offset=${offset}`))
  const getSubscription = (id) => execute(instance.get(`/sector/${id}`))
  const createSubscription = (system) =>
    execute(instance.post("/testSystem", system))
  const deleteSubscription = (id) => execute(instance.delete(`/testSystem/${id}`))

  // GROUP & FILTER
  const getSearchSubscriptions = (data = "", search = "", limit = 0, offset = 0) =>
    execute(
      instance.get(
        `/subscribed/${data}?limit=${limit}&offset=${offset}&alias=${search}&ref=${search}`
      )
    )

  return {
    getSubscriptions,
    getSubscription,
    createSubscription,
    deleteSubscription,

    getSearchSubscriptions
  }
}

export default SubscriptionService
