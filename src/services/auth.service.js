import ServiceConstructor from "."

class AuthService extends ServiceConstructor {
  health = () => this.makeRequest(this.instance.get("/health"))
  login = (data) => this.makeRequest(this.instance.post("/user/login", data))
}

export default AuthService
