import UserService from "../../services/user.services"

const useUserApi = () => {
  const userService = new UserService()

  const getUsers = () => userService.getUsers()

  return { getUsers }
}

export default useUserApi
