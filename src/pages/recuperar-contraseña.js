import { useRouter } from "next/dist/client/router"
import React, { useContext, useEffect } from "react"
import { Context } from "../context"
import { RecoverPassword } from "../views/auth/RecoverPassword/RecoverPassword"

const recuperarContraseña = () => {
  const router = useRouter()
  const {
    state: { logged },
  } = useContext(Context)

  useEffect(() => {
    if (!logged) return
    router.push("/")
  }, [])

  return <RecoverPassword />
}

export default recuperarContraseña
