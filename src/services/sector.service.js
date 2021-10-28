import { ServiceConstructor } from "."

const SectorService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getSectors = (data = "", limit = 2, offset = 0) =>
    execute(instance.get(`/sector?limit=${limit}&offset=${offset}${data}`))
  const getSector = (id) => execute(instance.get(`/sector/${id}`))
  const createSector = (data) => execute(instance.post(`/sector/create`, data))
  const updateSector = (id, data) =>
    execute(instance.put(`/sector/update/${id}`, data))
  const deleteSector = (id) => execute(instance.delete(`/sector/delete/${id}`))

  // GROUP & FILTER
  const getSearchSectors = (data) =>
    execute(instance.get(`/sector/filter?title=${data}&ref=${data}`))

  return {
    getSectors,
    getSector,
    createSector,
    updateSector,
    deleteSector,

    getSearchSectors
  }
}

export default SectorService
