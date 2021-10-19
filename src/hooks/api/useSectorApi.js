import SectorService from "../../services/sector.service"

const useSectorApi = () => {
  const sectorService = SectorService()

  // CRUD
  const getSectors = (_, data) => sectorService.getSectors(data)
  const getSector = (_, id) => sectorService.getSector(id)
  const createSector = (data) => sectorService.createSector(data)
  const updateSector = (id, data) => sectorService.updateSector(id, data)
  const deleteSector = (id) => sectorService.deleteSector(id)

  // GROUP & FILTER
  const getSearchSectors = (_, data) => sectorService.getSearchSectors(data)

  return {
    getSectors,
    getSector,
    createSector,
    updateSector,
    deleteSector,

    getSearchSectors
  }
}

export default useSectorApi
