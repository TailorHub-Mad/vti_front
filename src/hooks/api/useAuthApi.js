import AuthService from "../../services/auth.service"

const useAuthApi = () => {
  const authService = AuthService()

  const login = (data) => authService.login(data)
  const me = () => authService.me()

  return { login, me }
}

export default useAuthApi
