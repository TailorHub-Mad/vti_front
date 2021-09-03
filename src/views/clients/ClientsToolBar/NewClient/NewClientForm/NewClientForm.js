import { Input } from "@chakra-ui/react"
import React from "react"
import { SimpleInput } from "../../../../../components/forms/SimpleInput/SimpleInput"

export const NewClientForm = ({ value, onChange }) => {
  const formInputs = {
    id: {
      type: "text",
      config: {
        placeholder: "ID",
        label: "ID",
      },
    },
    alias: {
      type: "text",
      config: {
        placeholder: "Alias",
        label: "Alias",
      },
    },
    name: {
      type: "text",
      config: {
        placeholder: "Nombre",
        label: "Nombre",
      },
    },
  }

  const inputRefObj = {
    text: <SimpleInput />,
  }

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value,
    })
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], idx) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: name === "name" ? "0" : "24px",
          isDisabled: idx !== 0 && !value[Object.keys(value)[idx - 1]],
          ...config,
        })
      })}
    </>
  )
}
