import * as React from "react"

export const Context = React.createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ROLE": {
      return { ...state, role: state.role }
    }

    case "IS_LOGGED": {
      return { ...state, logged: true }
    }

    case "LOG_OUT": {
      return { ...state, logged: false }
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, {
    role: "ADMIN",
    logged: false,
  })
  const value = { state, dispatch }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
