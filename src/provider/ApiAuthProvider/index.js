import { useRouter } from "next/dist/client/router"
import React, { useState, useEffect, useCallback } from "react"
import useAuthApi from "../../hooks/api/useAuthApi"
import useFetchSWR from "../../hooks/useFetchSWR"
import { PATHS } from "../../utils/constants/paths"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { destroySessionCookie } from "../../utils/functions/cookies"
import { LoadingView } from "../../views/common/LoadingView"

export const ApiAuthContext = React.createContext()

const ApiAuthProvider = ({ children }) => {
  const router = useRouter()
  const { me } = useAuthApi()

  const { data, error, isLoading } = useFetchSWR(SWR_CACHE_KEYS.me, me)

  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
    if (!error) return

    setIsLoggedIn(false)
    if (error.response?.status === 401 && router.route !== PATHS.login)
      return router.push(PATHS.login)
  }, [error])

  useEffect(() => {
    if (!data) return

    setUser(data[0])
    setRole(data[0].role)
    setIsLoggedIn(true)

    if (router.pathname === PATHS.login) router.push(PATHS.root)
  }, [data])

  if (error) return <LoadingView />
  if (isLoading) return <LoadingView />
  return (
    <ApiAuthContext.Provider value={contextValue}>
      {children}
    </ApiAuthContext.Provider>
  )
}

export default ApiAuthProvider
