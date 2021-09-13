import { ServiceConstructor } from "."

const SectorService = () => {
  const { instance, execute } = ServiceConstructor

  const getSectors = (limit = 50, offset = 0) =>
    execute(instance.get(`/sector/all?limit=${limit}&offset=${offset}`))
  const getSector = (id) => execute(instance.get(`/sector/${id}`))
  const createSector = (data) => execute(instance.post(`/sector/create`, data))
  const updateSector = (data) => execute(instance.put(`/sector/${data.id}`, data))
  const deleteSector = (id) => execute(instance.delete(`/sector/${id}`))

  return { getSectors, getSector, createSector, updateSector, deleteSector }
}

export default SectorService
