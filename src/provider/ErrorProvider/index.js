import React from "react"

export const ErrorContext = React.createContext()

export default function ErrorProvider({ children }) {
  const contextValue = {}

  return (
    <ErrorContext.Provider value={contextValue}>{children}</ErrorContext.Provider>
  )
}
