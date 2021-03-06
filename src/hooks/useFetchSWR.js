import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import useSWR from "swr"
import { ApiAuthContext } from "../provider/ApiAuthProvider"
import { PATHS, WHITE_LIST } from "../utils/constants/global"

const useFetchSWR = (key, fetcher, refreshInterval) => {
  const router = useRouter()
  const authContext = useContext(ApiAuthContext)

  const [isLoading, setIsLoading] = useState(false)

  const { data, error, mutate, isValidating } = useSWR(key, fetcher, {
    loadingTimeout: 1000,
    onLoadingSlow() {
      setIsLoading(true)
    },
    dedupingInterval: 5000,
    errorRetryCount: 10,
    refreshInterval: refreshInterval || 30000
  })

  const isUnauthorize = error?.response?.status === 401

  useEffect(() => {
    if (data && isLoading) {
      const timer = setTimeout(setIsLoading, 1000, false)
      return () => clearTimeout(timer)
    }
  }, [data, isLoading])

  useEffect(() => {
    if (!isUnauthorize) return
    if (WHITE_LIST.includes(router.route)) return
    authContext && authContext.setIsLoggedIn(false)
    router.push(PATHS.login)
  }, [isUnauthorize])

  if (isUnauthorize) return { unauthorize: true }

  return { data, error, isLoading, mutate, isValidating }
}

export default useFetchSWR
