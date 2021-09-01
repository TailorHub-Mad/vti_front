import ServiceConstructor from "."

class AuthService extends ServiceConstructor {
  health = () => this.makeRequest(this.instance.get("/health"))
  login = (user) =>
    this.instance
      .get("/user/login", user)
      .then((response) => response.data)
      .catch(this.errorHandler)
}

export default AuthService
