import UserService from "../../services/user.services"
import useApiError from "../useApiError"

const useUserApi = () => {
  const { addError, removeError } = useApiError()
  const userService = new UserService(addError, removeError)

  const getUsers = () => userService.getUsers()


  return { getUsers}
}

export default useUserApi
