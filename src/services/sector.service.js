import ServiceConstructor from "."

class SectorService extends ServiceConstructor {
  getSectors = () => this.makeRequest(this.instance.get("/sectors?limit=50"))

  getSector = (id) => this.makeRequest(this.instance.get(`/sector/${id}`))

  createSector = (data) =>
    this.makeRequest(this.instance.post(`/sector/create`, data))

  updateSector = (data) =>
    this.makeRequest(this.instance.put(`/sector/${data.id}`, data))

  deleteSector = (id) => this.makeRequest(this.instance.delete(`/sector/${id}`))
}

export default SectorService
