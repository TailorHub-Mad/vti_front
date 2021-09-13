import SystemService from "../../services/systems.service"

const useSystemApi = () => {
  const systemService = SystemService()

  const systems = () => systemService.systems()
  const system = (id) => systemService.system(id)
  const createSystem = (system) => systemService.createSystem(system)
  const editSystem = (id, system) => systemService.editSystem(id, system)
  const deleteSystem = (id) => systemService.deleteSystem(id)

  return { systems, system, createSystem, editSystem, deleteSystem }
}

export default useSystemApi
