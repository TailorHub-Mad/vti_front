import React, { useState } from "react"
import { TOAST_DEFAULT_TIME } from "../../utils/constants/global"

export const ToastContext = React.createContext()

const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null)
  const [isToastOpen, setIsToastOpen] = useState(false)
  const [toastType, setToastType] = useState(false)

  const showToast = (message, time = TOAST_DEFAULT_TIME, type) => {
    setMessage(message)
    setIsToastOpen(true)
    setTimeout(() => {
      setIsToastOpen(false)
      setMessage("")
    }, time)
    setToastType(type)
  }

  const contextValue = {
    message,
    showToast: (message, type, time) => showToast(message, time, type),
    isToastOpen,
    toastType
  }

  return (
    <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
  )
}

export default ToastProvider
