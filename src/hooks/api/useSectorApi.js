import SectorService from "../../services/sector.service"

const useSectorApi = () => {
  const sectorService = SectorService()

  const getSectors = () => sectorService.getSectors()
  const getSector = (_, id) => sectorService.getSector(id)
  const createSector = (data) => sectorService.createSector(data)
  const updateSector = (id, data) => sectorService.updateSector(id, data)
  const deleteSector = (id) => sectorService.deleteSector(id)

  return { getSectors, getSector, createSector, updateSector, deleteSector }
}

export default useSectorApi
