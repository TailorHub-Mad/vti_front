import SystemService from "../../services/systems.service"
import useApiError from "../useApiError"

const useSystemApi = () => {
  const { addError, removeError } = useApiError()

  const systemService = new SystemService(addError, removeError)

  const systems = () => systemService.systems()
  const system = (id) => systemService.system(id)
  const createSystem = (system) => systemService.createSystem(system)
  const editSystem = (id, system) => systemService.editSystem(id, system)
  const deleteSystem = (id) => systemService.deleteSystem(id)

  return { systems, system, createSystem, editSystem, deleteSystem }
}

export default useSystemApi
