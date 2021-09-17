import { ServiceConstructor } from "."

const SectorService = () => {
  const { instance, execute } = ServiceConstructor

  const getSectors = (limit = 50, offset = 0) =>
    execute(instance.get(`/sector?limit=${limit}&offset=${offset}`))
  const getSector = (id) => execute(instance.get(`/sector/${id}`))
  const createSector = (data) => execute(instance.post(`/sector/create`, data))
  const updateSector = (id, data) =>
    execute(instance.put(`/sector/update/${id}`, data))
  const deleteSector = (id) => execute(instance.delete(`/sector/delete/${id}`))

  return { getSectors, getSector, createSector, updateSector, deleteSector }
}

export default SectorService
