import { useRouter } from "next/dist/client/router"
import React, { useEffect } from "react"
import ServiceConstructor from "../services"
import { Login } from "../views/auth/Login/Login"

const login = () => {
  const router = useRouter()

  useEffect(() => {
    if (!new ServiceConstructor().token) return
    router.push("/")
  }, [])

  return <Login />
}

export default login
