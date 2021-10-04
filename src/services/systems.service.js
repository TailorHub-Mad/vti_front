import { ServiceConstructor } from "."

const SystemService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getSystems = (limit = 0, offset = 0) =>
    execute(instance.get(`/testSystem?limit=${limit}&offset=${offset}`))
  const getSystem = (id) => execute(instance.get(`/testSystem/${id}`))
  const createSystem = (system) => execute(instance.post("/testSystem", system))
  const updateSystem = (id, system) =>
    execute(instance.put(`/testSystem/${id}`, system))
  const deleteSystem = (id) => execute(instance.delete(`/testSystem/${id}`))

  // GROUP & FILTER
  const getGroupSystems = (data) =>
    execute(instance.get(`/testSystem/group?group=${data}&real=true`))
  const getFilterSystems = (data) =>
    execute(instance.get(`/testSystem/filter?${data}`))
  const getSearchSystems = (data) =>
    execute(
      instance.get(
        `/testSystem/filter?testSystems.vtiCode=${data}&testSystems.ref=${data}&testSystems.alias=${data}`
      )
    )

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

export default SystemService
