import AuthService from "../../services/auth.service"
import useError from "../useError"

const useAuthApi = () => {
  const { addError, removeError } = useError()

  const authService = new AuthService(addError, removeError)

  const login = (data) => authService.login(data)
  const me = () => authService.me()

  return { login, me }
}

export default useAuthApi
