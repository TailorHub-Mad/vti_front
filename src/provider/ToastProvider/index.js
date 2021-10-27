import React, { useState } from "react"
import { TOAST_DEFAULT_TIME } from "../../utils/constants/global"

export const ToastContext = React.createContext()

const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null)
  const [secondaryMessage, setSecondaryMessage] = useState(null)
  const [isToastOpen, setIsToastOpen] = useState(false)
  const [toastType, setToastType] = useState(false)

  const showToast = ({
    message,
    time = TOAST_DEFAULT_TIME,
    type,
    secondaryMessage
  }) => {
    setMessage(message)
    setIsToastOpen(true)
    secondaryMessage && setSecondaryMessage(secondaryMessage)
    setTimeout(() => {
      setIsToastOpen(false)
      setMessage("")
      setSecondaryMessage("")
    }, time)
    setToastType(type)
  }

  const contextValue = {
    message,
    secondaryMessage,
    showToast: ({ message, type, time, secondaryMessage }) =>
      showToast({ message, time, type, secondaryMessage }),
    isToastOpen,
    toastType
  }

  return (
    <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
  )
}

export default ToastProvider
