import ServiceConstructor from "."

class AuthService extends ServiceConstructor {
  health = () => this.makeRequest(this.instance.get("/health"))
  login = (data) => this.makeRequest(this.instance.post("/user/login", data))
  me = () => this.makeRequest(this.instance.get("/user/me"))
}

export default AuthService
