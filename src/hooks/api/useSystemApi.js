import SystemService from "../../services/systems.service"

const useSystemApi = () => {
  const systemService = SystemService()

  const getSystems = () => systemService.getSystems()
  const getSystem = (_, id) => systemService.getSystem(id)
  const createSystem = (system) => systemService.createSystem(system)
  const updateSystem = (id, system) => systemService.updateSystem(id, system)
  const deleteSystem = (id) => systemService.deleteSystem(id)

  return { getSystems, getSystem, createSystem, updateSystem, deleteSystem }
}

export default useSystemApi
