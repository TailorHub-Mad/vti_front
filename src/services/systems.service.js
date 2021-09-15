import { ServiceConstructor } from "."

const SystemService = () => {
  const { instance, execute } = ServiceConstructor

  const systems = (limit = 50, offset = 0) =>
    execute(instance.get(`/testSystem?limit=${limit}&offset=${offset}`))
  const system = (id) => execute(instance.get(`/testSystem/${id}`))
  const createSystem = (system) => execute(instance.post("/testSystem", system))
  const updateSystem = (id, system) =>
    execute(instance.put(`/testSystem/${id}`, system))
  const deleteSystem = (id) => execute(instance.delete(`/testSystem/${id}`))

  return { systems, system, createSystem, updateSystem, deleteSystem }
}

export default SystemService
