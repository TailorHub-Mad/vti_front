import { ServiceConstructor } from "."

const ClientService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getClients = (data, limit = 0, offset = 0) =>
    execute(instance.get(`/clients?limit=${limit}&offset=${offset}${data}`))
  const getClient = (id) => execute(instance.get(`/clients/${id}`))
  const createClient = (data) => execute(instance.post(`/clients/create`, data))
  const updateClient = (id, data) => execute(instance.put(`/clients/${id}`, data))
  const deleteClient = (id) => execute(instance.delete(`/clients/${id}`))

  // GROUP & FILTER
  const getSearchClients = (data) =>
    execute(instance.get(`/clients/filter?alias=${data}&name=${data}&ref=${data}`))

  return {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,

    getSearchClients
  }
}

export default ClientService
