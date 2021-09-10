import { ServiceConstructor } from "."

const ClientService = () => {
  const { instance, execute } = ServiceConstructor

  const getClients = () => execute(instance.get("/clients?limit=50"))
  const getClient = (id) => execute(instance.get(`/clients/${id}`))
  const createClient = (data) => execute(instance.post(`/clients/create`, data))
  const updateClient = (data) => execute(instance.put(`/clients/${data.id}`, data))
  const deleteClient = (id) => execute(instance.delete(`/clients/${id}`))

  return { getClients, getClient, createClient, updateClient, deleteClient }
}

export default ClientService
