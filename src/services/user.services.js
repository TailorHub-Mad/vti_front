import ServiceConstructor from "."

class UserService extends ServiceConstructor {
  getUsers = () =>
    this.makeRequest(
      this.instance.get(`/user/all`)
    )
  //TODO CRUD completo
}

export default UserService
