import ServiceConstructor from "."

class ClientsService extends ServiceConstructor {
  getClients = () => this.makeRequest(this.instance.get("/clients?limit=50"))

  getClient = (id) => this.makeRequest(this.instance.get(`/clients/${id}`))

  createClient = (data) =>
    this.makeRequest(this.instance.post(`/clients/create`, data))

  updateClient = (data) =>
    this.makeRequest(this.instance.put(`/clients/${data.id}`, data))

  deleteClient = (id) => this.makeRequest(this.instance.delete(`/clients/${id}`))
}

export default ClientsService
