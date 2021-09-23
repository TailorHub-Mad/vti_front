import UserService from "../../services/user.services"

const useUserApi = () => {
  const userService = UserService()

  const getUsers = () => userService.getUsers()
  const getUser = (_, id) => userService.getUser(id)
  const createUser = (user) => userService.createUser(user)
  const updateUser = (id, user) => userService.updateUser(id, user)
  const deleteUser = (id) => userService.deleteUser(id)

  return { getUsers, getUser, createUser, updateUser, deleteUser }
}

export default useUserApi
