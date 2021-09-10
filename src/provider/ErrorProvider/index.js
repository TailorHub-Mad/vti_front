import React, { useState, useCallback } from "react"

export const ErrorContext = React.createContext({
  error: null,
  addError: () => {},
  removeError: () => {},
})

export default function ErrorProvider({ children }) {
  const [error, setError] = useState(null)

  const removeError = () => setError(null)

  const addError = (message) => setError(message)

  const contextValue = {
    error,
    addError: useCallback((message, status) => addError(message, status), []),
    removeError: useCallback(() => removeError(), []),
  }

  return (
    <ErrorContext.Provider value={contextValue}>{children}</ErrorContext.Provider>
  )
}
