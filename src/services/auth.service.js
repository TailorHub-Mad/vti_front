import ServiceConstructor from "."

class AuthService extends ServiceConstructor {
  login = (data) => this.makeRequest(this.instance.post("/user/login", data))
  me = () => this.makeRequest(this.instance.get("/user/me"))
}

export default AuthService
