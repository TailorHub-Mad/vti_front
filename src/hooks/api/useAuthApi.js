import AuthService from "../../services/auth.service"

const useAuthApi = () => {
  const authService = AuthService()

  const login = (data) => authService.login(data)
  const sendRecoveryPassword = (data) => authService.sendRecoveryPassword(data)
  const sendCreatePassword = (data) => authService.sendCreatePassword(data)
  const recoveryPassword = (data) => authService.recoveryPassword(data)
  const me = () => authService.me()

  return { login, sendRecoveryPassword, sendCreatePassword, recoveryPassword, me }
}

export default useAuthApi
