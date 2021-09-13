import { ServiceConstructor } from "."

const AuthService = () => {
  const { instance, execute } = ServiceConstructor

  const login = (data) => execute(instance.post("/user/login", data))
  const me = () => execute(instance.get("/user/me"))

  return { login, me }
}

export default AuthService
