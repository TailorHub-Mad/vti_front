import SystemService from "../../services/systems.service"

const useSystemApi = () => {
  const systemService = SystemService()

  // CRUD
  const getSystems = () => systemService.getSystems()
  const getSystem = (_, id) => systemService.getSystem(id)
  const createSystem = (system) => systemService.createSystem(system)
  const updateSystem = (id, system) => systemService.updateSystem(id, system)
  const deleteSystem = (id) => systemService.deleteSystem(id)

  // GROUP & FILTER
  const getGroupSystems = (_, data) => systemService.getGroupSystems(data)
  const getFilterSystems = (_, data) => systemService.createSystem(data)
  const getSearchSystems = (_, data) => systemService.createSystem(data)

  return {
    getSystems,
    getSystem,
    createSystem,
    updateSystem,
    deleteSystem,

    getGroupSystems,
    getFilterSystems,
    getSearchSystems
  }
}

export default useSystemApi
