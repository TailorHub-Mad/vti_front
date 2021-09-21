import { useRouter } from "next/dist/client/router"
import React, { useState, useEffect, useCallback } from "react"
import useAuthApi from "../../hooks/api/useAuthApi"
import { PATHS } from "../../utils/constants/paths"
import { destroySessionCookie } from "../../utils/functions/cookies"

export const ApiAuthContext = React.createContext()

const ApiAuthProvider = ({ children }) => {
  const router = useRouter()
  const { me } = useAuthApi()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const getUser = async () => {
    try {
      const _user = await me()
      setUser(_user[0])
      setRole(_user[0].role)
      setIsLoggedIn(true)

      if (router.pathname === PATHS.login) router.push(PATHS.root)
    } catch (error) {
      setIsLoggedIn(false)
      if (error.response?.status === 401 && router.route !== PATHS.login)
        return router.push(PATHS.login)
    }
  }

  const _setUser = (user) => setUser(user)
  const _setIsLoggedIn = (value) => setIsLoggedIn(value)
  const _setRole = (role) => setRole(role)
  const _logout = () => {
    destroySessionCookie()
    setUser(null)
    setRole(null)
    setIsLoggedIn(false)
    router.push(PATHS.login)
  }

  const contextValue = {
    user,
    role,
    isLoggedIn,
    setUser: useCallback((userData) => _setUser(userData), []),
    setRole: useCallback((role) => _setRole(role), []),
    setIsLoggedIn: useCallback((value) => _setIsLoggedIn(value), []),
    logout: () => _logout()
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <ApiAuthContext.Provider value={contextValue}>
      {children}
    </ApiAuthContext.Provider>
  )
}

export default ApiAuthProvider
