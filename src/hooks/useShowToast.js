import React, { useEffect, useState } from "react"
import { Popup } from "../components/overlay/Popup/Popup"

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
