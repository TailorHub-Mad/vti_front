import React, { useState } from "react"
import { TOAST_DEFAULT_TIME } from "../../utils/constants/global_config"

export const ToastContext = React.createContext()

const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null)
  const [isToastOpen, setIsToastOpen] = useState(false)

  const showToast = (message, time = TOAST_DEFAULT_TIME) => {
    setMessage(message)
    setIsToastOpen(true)
    setTimeout(() => {
      setIsToastOpen(false)
      setMessage("")
    }, time)
  }

  const contextValue = {
    message,
    showToast: (message, time) => showToast(message, time),
    isToastOpen
  }

  return (
    <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
  )
}

export default ToastProvider
