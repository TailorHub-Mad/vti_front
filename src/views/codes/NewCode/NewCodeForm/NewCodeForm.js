import React from "react"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"

export const NewCodeForm = ({ value, onChange }) => {
  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    title: {
      type: "text",
      config: {
        placeholder: "Nombre",
        label: "Nombre"
      }
    }
  }

  const inputRefObj = {
    text: <SimpleInput />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          isDisabled: index !== 0 && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}
