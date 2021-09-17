import ClientService from "../../services/client.service"

const useClientApi = () => {
  const clientService = ClientService()

  const getClients = () => clientService.getClients()
  const getClient = (_, id) => clientService.getClient(id)
  const createClient = (data) => clientService.createClient(data)
  const updateClient = (id, data) => clientService.updateClient(id, data)
  const deleteClient = (id) => clientService.deleteClient(id)

  return { getClients, getClient, createClient, updateClient, deleteClient }
}

export default useClientApi
