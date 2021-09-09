import React, { useState, useCallback } from "react"

export const ApiErrorContext = React.createContext({
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
    <ApiErrorContext.Provider value={contextValue}>
      {children}
    </ApiErrorContext.Provider>
  )
}
