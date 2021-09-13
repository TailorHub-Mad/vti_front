import { ServiceConstructor } from "."

const UserService = () => {
  const { instance, execute } = ServiceConstructor
  const getUsers = () => execute(instance.get(`/user/all`))
  //TODO CRUD completo

  return { getUsers }
}

export default UserService
