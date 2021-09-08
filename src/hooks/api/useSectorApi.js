import SectorService from "../../services/sector.service"
import useApiError from "../useApiError"

const useSectorApi = () => {
  const { addError, removeError } = useApiError()
  const sectorService = new SectorService(addError, removeError)

  const getSectors = () => sectorService.getSectors()

  const getSector = (id) => sectorService.getSector(id)

  const createSector = (data) => sectorService.createSector(data)

  const updateSector = (data) => sectorService.updateSector(data)

  const deleteSector = (id) => sectorService.deleteSector(id)

  return { getSectors, getSector, createSector, updateSector, deleteSector }
}

export default useSectorApi
