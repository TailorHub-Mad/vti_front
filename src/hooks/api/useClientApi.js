import ClientService from "../../services/client.service"
import useApiError from "../useApiError"

const useClientApi = () => {
  const { addError, removeError } = useApiError()
  const clientService = new ClientService(addError, removeError)

  const getClients = () => clientService.getClients()

  const getClient = (id) => clientService.getClient(id)

  const createClient = (data) => clientService.createClient(data)

  const updateClient = (data) => clientService.updateClient(data)

  const deleteClient = (id) => clientService.deleteClient(id)

  return { getClients, getClient, createClient, updateClient, deleteClient }
}

export default useClientApi
