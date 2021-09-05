import ServiceConstructor from "."

class SystemService extends ServiceConstructor {
  systems = () => this.makeRequest(this.instance.get("/testSystem"))
}

export default SystemService
