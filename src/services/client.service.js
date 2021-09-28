import { ServiceConstructor } from "."

const ClientService = () => {
  const { instance, execute } = ServiceConstructor

  const getClients = (limit = 0, offset = 0) =>
    execute(instance.get(`/clients?limit=${limit}&offset=${offset}`))
  const getClient = (id) => execute(instance.get(`/clients/${id}`))
  const createClient = (data) => execute(instance.post(`/clients/create`, data))
  const updateClient = (id, data) => execute(instance.put(`/clients/${id}`, data))
  const deleteClient = (id) => execute(instance.delete(`/clients/${id}`))

  return { getClients, getClient, createClient, updateClient, deleteClient }
}

export default ClientService
