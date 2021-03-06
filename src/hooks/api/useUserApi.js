import UserService from "../../services/user.services"

const useUserApi = () => {
  const userService = UserService()

  // CRUD
  const getUsers = (_, data) => userService.getUsers(data)
  const getUser = (_, id) => userService.getUser(id)
  const createUser = (user) => userService.createUser(user)
  const updateUser = (id, user) => userService.updateUser(id, user)
  const deleteUser = (id) => userService.deleteUser(id)

  // GROUP & FILTER
  const getGroupUsers = (_, data) => userService.getGroupUsers(data)
  const getSearchUsers = (_, data) => userService.getSearchUsers(data)
  const getFilterUsers = (_, data) => userService.getFilterUsers(data)

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,

    getGroupUsers,
    getFilterUsers,
    getSearchUsers
  }
}

export default useUserApi
