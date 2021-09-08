import SystemService from "../../services/systems.service"
import useApiError from "../useApiError"

const useSystemApi = () => {
  const { addError, removeError } = useApiError()

  const systemService = new SystemService(addError, removeError)

  const systems = () => systemService.systems()
  const createSystem = (system) => systemService.createSystem(system)
  const editSystem = () => systemService.editSystem()
  const deleteSystem = (id) => systemService.deleteSystem(id)

  return { systems, createSystem, editSystem, deleteSystem }
}

export default useSystemApi
