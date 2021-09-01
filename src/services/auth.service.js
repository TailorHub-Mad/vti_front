import ServiceConstructor from "."

class AuthService extends ServiceConstructor {
  login = (user) =>
    this.instance
      .get("/user/login", user)
      .then((response) => response.data)
      .catch(this.errorHandler)
}

export default AuthService
