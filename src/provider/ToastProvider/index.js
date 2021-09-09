import React, { useState } from "react"
import { TOAST_DEFAULT_TIME } from "../../utils/constants/global_config"

export const ApiToastContext = React.createContext()

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
    isToastOpen,
  }

  return (
    <ApiToastContext.Provider value={contextValue}>
      {children}
    </ApiToastContext.Provider>
  )
}

export default ToastProvider
