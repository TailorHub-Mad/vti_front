import React, { useEffect, useState } from "react"
import { TOAST_DEFAULT_TIME } from "../../utils/constants/global"

export const ToastContext = React.createContext()

const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null)
  const [secondaryMessage, setSecondaryMessage] = useState(null)
  const [isToastOpen, setIsToastOpen] = useState(false)
  const [toastType, setToastType] = useState(false)
  const setTimeOut = []

  function eventListener(e) {
    if (e.key === "Enter") {
      setIsToastOpen(false)
      setMessage("")
      setSecondaryMessage("")
      setTimeOut.forEach(clearTimeout)
      window.removeEventListener('keypress', eventListener);
    }
  }

  const showToast = ({
    message,
    // eslint-disable-next-line no-unused-vars
    time = TOAST_DEFAULT_TIME,
    type,
    secondaryMessage
  }) => {
    
    setMessage(message)
    setIsToastOpen(true)
    secondaryMessage && setSecondaryMessage(secondaryMessage)
    const timeOut = setTimeout(() => {
      setIsToastOpen(false)
      setMessage("")
      setSecondaryMessage("")
    }, 8000)
    if (window) {
      window.addEventListener("keypress", eventListener);
    }
    setTimeOut.push(timeOut)
    setToastType(type)
  }

  useEffect(() => {
    return () => {
      setIsToastOpen(false)
      setMessage("")
      setSecondaryMessage("")
      setTimeOut.forEach(clearTimeout)
    }
  }, [])

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
