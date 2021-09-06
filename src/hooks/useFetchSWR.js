import { useEffect, useState } from "react"
import useSWR from "swr"

const useFetchSWR = (key, fetcher, refreshInterval) => {
  const [isLoading, setIsLoading] = useState(false)

  const { data, error, mutate } = useSWR(key, fetcher, {
    loadingTimeout: 1000,
    onLoadingSlow() {
      setIsLoading(true)
    },
    dedupingInterval: 5000,
    errorRetryCount: 10,
    refreshInterval: refreshInterval || 30000,
  })

  useEffect(() => {
    if (data && isLoading) {
      const timer = setTimeout(setIsLoading, 1000, false)
      return () => clearTimeout(timer)
    }
  }, [data, isLoading])

  return { data, error, isLoading, mutate }
}

export default useFetchSWR
