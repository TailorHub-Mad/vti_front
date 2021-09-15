import SystemService from "../../services/systems.service"

const useSystemApi = () => {
  const systemService = SystemService()

  const systems = () => systemService.systems()
  const system = (id) => systemService.system(id)
  const createSystem = (system) => systemService.createSystem(system)
  const updateSystem = (id, system) => systemService.updateSystem(id, system)
  const deleteSystem = (id) => systemService.deleteSystem(id)

  return { systems, system, createSystem, updateSystem, deleteSystem }
}

export default useSystemApi
