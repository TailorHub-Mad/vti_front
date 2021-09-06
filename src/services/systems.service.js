import ServiceConstructor from "."

class SystemService extends ServiceConstructor {
  systems = () => this.makeRequest(this.instance.get("/testSystem?limit=50"))
}

export default SystemService
