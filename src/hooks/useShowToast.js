import { useState } from "react"

export const useShowToast = (time = 3000) => {
  const [isToastOpen, setIsToastOpen] = useState(false)

  const showToast = () => {
    setIsToastOpen(true)
    setTimeout(() => {
      setIsToastOpen(false)
    }, time)
  }

  return { showToast, isToastOpen }
}
