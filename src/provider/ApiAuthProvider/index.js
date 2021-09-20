import { useRouter } from "next/dist/client/router"
import React, { useState, useEffect, useCallback } from "react"
import useAuthApi from "../../hooks/api/useAuthApi"

export const ApiAuthContext = React.createContext()

const ApiAuthProvider = ({ children }) => {
  const router = useRouter()
  const { me } = useAuthApi()

  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const _setUser = (user) => setUser(user)
  const _setIsLoggedIn = (value) => setIsLoggedIn(value)
  const _setRole = (role) => setRole(role)

  const contextValue = {
    user,
    role,
    isLoggedIn,
    setUser: useCallback((userData) => _setUser(userData), []),
    setRole: useCallback((role) => _setRole(role), []),
    setIsLoggedIn: useCallback((value) => _setIsLoggedIn(value), [])
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const _user = await me()
        setUser(_user[0])
        // TODO -> provisional
        // setRole(_user[0].role)
        setRole("admin")
        setIsLoggedIn(true)
      } catch (error) {
        setIsLoggedIn(false)
        if (error.response.status === 401 && router.route !== "/login")
          return router.push("/login")
      }
    }
    getUser()
  }, [])

  return (
    <ApiAuthContext.Provider value={contextValue}>
      {children}
    </ApiAuthContext.Provider>
  )
}

export default ApiAuthProvider
