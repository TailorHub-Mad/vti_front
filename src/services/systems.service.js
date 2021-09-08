import ServiceConstructor from "."

class SystemService extends ServiceConstructor {
  systems = (limit = 50, offset = 0) =>
    this.makeRequest(
      this.instance.get(`/testSystem?limit=${limit}&offset=${offset}`)
    )
  createSystem = (system) =>
    this.makeRequest(this.instance.post("/testSystem", system))
  editSystem = () => this.makeRequest(this.instance.get("/testSystem?limit=50"))
  deleteSystem = (id) => this.makeRequest(this.instance.delete(`/testSystem/${id}`))
}

export default SystemService
