import { useEffect, useState } from "react"
import useSWR from "swr"

const useFetchSWR = (key, fetcher) => {
  const [isLoadingSlow, setIsLoadingSlow] = useState(false)

  const { data, error } = useSWR(key, fetcher, {
    loadingTimeout: 1000,
    onLoadingSlow() {
      setIsLoadingSlow(true)
    },
  })

  useEffect(() => {
    if (data && isLoadingSlow) {
      const timer = setTimeout(setIsLoadingSlow, 1000, false)
      return () => clearTimeout(timer)
    }
  }, [data, isLoadingSlow])

  return { data, error, isLoadingSlow }
}

export default useFetchSWR
