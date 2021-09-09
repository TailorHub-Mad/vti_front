import ServiceConstructor from "."

class SystemService extends ServiceConstructor {
  systems = (limit = 50, offset = 0) =>
    this.makeRequest(
      this.instance.get(`/testSystem?limit=${limit}&offset=${offset}`)
    )
  system = (id) => this.makeRequest(this.instance.get(`/testSystem/${id}`))
  createSystem = (system) =>
    this.makeRequest(this.instance.post("/testSystem", system))
  editSystem = (id, system) =>
    this.makeRequest(this.instance.put(`/testSystem/${id}`, system))
  deleteSystem = (id) => this.makeRequest(this.instance.delete(`/testSystem/${id}`))
}

export default SystemService
