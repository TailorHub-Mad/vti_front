import * as React from "react"

export const Context = React.createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ROLE": {
      return { role: state.role }
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, { role: "ADMIN" })
  const value = { state, dispatch }
  return <Context.Provider value={value}>{children}</Context.Provider>
}
