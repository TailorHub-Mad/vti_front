import { ServiceConstructor } from "."

const ClientService = () => {
  const { instance, execute } = ServiceConstructor

  const getClients = (limit = 50, offset = 0) =>
    execute(instance.get(`/clients?limit=${limit}&offset=${offset}`))
  const getClient = (id) => execute(instance.get(`/clients/${id}`))
  const createClient = (data) => execute(instance.post(`/clients/create`, data))
  const updateClient = (data) => execute(instance.put(`/clients/${data.id}`, data))
  const deleteClient = (id) => execute(instance.delete(`/clients/${id}`))

  return { getClients, getClient, createClient, updateClient, deleteClient }
}

export default ClientService
