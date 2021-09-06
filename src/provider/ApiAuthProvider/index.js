import { useRouter } from "next/dist/client/router"
import React, { useState, useEffect, useCallback } from "react"
import useAuthApi from "../../hooks/api/useAuthApi"

export const ApiUserContext = React.createContext()

const ApiUserProvider = ({ children }) => {
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
    setIsLoggedIn: useCallback((value) => _setIsLoggedIn(value), []),
  }

  useEffect(() => {
    const getUser = async () => {
      const _user = await me()
      if (_user.error) return router.push("/login")
      setUser(_user[0])
      // setRole(_user[0].role)
      setRole("admin")
      setIsLoggedIn(true)
    }
    getUser()
  }, [])
  return (
    <ApiUserContext.Provider value={contextValue}>
      {children}
    </ApiUserContext.Provider>
  )
}

export default ApiUserProvider
