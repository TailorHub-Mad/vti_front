import AuthService from "../../services/auth.service"
import useApiError from "../useApiError"

const useAuthApi = () => {
  const { addError, removeError } = useApiError()

  const authService = new AuthService(addError, removeError)

  const login = (data) => authService.login(data)
  const me = () => authService.me()

  return { login, me }
}

export default useAuthApi
