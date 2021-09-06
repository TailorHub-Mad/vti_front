import ClientsService from "../../services/clients.service"
import useApiError from "../useApiError"

const useClientsApi = () => {
  const { addError, removeError } = useApiError()
  const clientService = new ClientsService(addError, removeError)

  const getClients = () => clientService.getClients()

  const getClient = (id) => clientService.getClient(id)

  const createClient = (data) => clientService.createClient(data)

  const updateClient = (data) => clientService.updateClient(data)

  const deleteClient = (id) => clientService.deleteClient(id)

  return { getClients, getClient, createClient, updateClient, deleteClient }
}

export default useClientsApi
