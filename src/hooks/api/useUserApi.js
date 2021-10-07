import UserService from "../../services/user.services"

const useUserApi = () => {
  const userService = UserService()

  // CRUD
  const getUsers = () => userService.getUsers()
  const getUser = (_, id) => userService.getUser(id)
  const createUser = (user) => userService.createUser(user)
  const updateUser = (id, user) => userService.updateUser(id, user)
  const deleteUser = (id) => userService.deleteUser(id)

  // GROUP & FILTER
  const getGroupUsers = (_, data) => userService.getGroupUsers(data)
  const getSearchUsers = (_, data) => userService.getSearchUsers(data)
  const getFilterUsers = (_, data) => userService.getSearchUsers(data)

  getSearchUsers

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,

    getGroupUsers,
    getFilterUsers
  }
}

export default useUserApi
