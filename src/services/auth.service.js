import { ServiceConstructor } from "."

const AuthService = () => {
  const { instance, execute } = ServiceConstructor

  const login = (data) => execute(instance.post("/user/login", data))
  const sendRecoveryPassword = (data) =>
    execute(instance.post("/user/resetPassword?isRecovery=true", data))
  const sendCreatePassword = (data) =>
    execute(instance.post("/user/resetPassword", data))
  const recoveryPassword = (data) => execute(instance.post("/user/recovery", data))
  const me = () => execute(instance.get("/user/me"))

  return { login, sendRecoveryPassword, sendCreatePassword, recoveryPassword, me }
}

export default AuthService
