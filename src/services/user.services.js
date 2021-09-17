import { ServiceConstructor } from "."

const UserService = () => {
  const { instance, execute } = ServiceConstructor
  const getUsers = () => execute(instance.get(`/user`))
  //TODO CRUD completo

  return { getUsers }
}

export default UserService
