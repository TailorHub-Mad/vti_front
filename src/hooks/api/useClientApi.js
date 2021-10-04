import ClientService from "../../services/client.service"

const useClientApi = () => {
  const clientService = ClientService()

  const getClients = () => clientService.getClients()
  const getClient = (_, id) => clientService.getClient(id)
  const createClient = (data) => clientService.createClient(data)
  const updateClient = (id, data) => clientService.updateClient(id, data)
  const deleteClient = (id) => clientService.deleteClient(id)

  // GROUP & FILTER
  const getSearchClients = (_, data) => clientService.getSearchClients(data)

  return {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,

    getSearchClients
  }
}

export default useClientApi
