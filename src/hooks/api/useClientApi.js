import ClientService from "../../services/client.service"

const useClientApi = () => {
  const clientService = ClientService()

  const getClients = () => clientService.getClients()
  const getClient = (id) => clientService.getClient(id)
  const createClient = (data) => clientService.createClient(data)
  const updateClient = (data) => clientService.updateClient(data)
  const deleteClient = (id) => clientService.deleteClient(id)

  return { getClients, getClient, createClient, updateClient, deleteClient }
}

export default useClientApi
