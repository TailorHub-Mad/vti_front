import { ServiceConstructor } from "."

const SectorService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getSectors = (data = "", limit = 0, offset = 0) =>
    execute(instance.get(`/sector?limit=${limit}&offset=${offset}${data}`))
  const getSector = (id) => execute(instance.get(`/sector/${id}`))

  // GROUP & FILTER
  const getSearchSectors = (data) =>
    execute(instance.get(`/sector/filter?title=${data}&ref=${data}`))

  return {
    getSectors,
    getSector,

    getSearchSectors
  }
}

export default SectorService
