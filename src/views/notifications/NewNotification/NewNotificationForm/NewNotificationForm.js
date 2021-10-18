import React from "react"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"

export const NewNotificationForm = ({ value, onChange, submitIsDisabled }) => {
  const _values = { ...value }

  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    description: {
      type: "text",
      config: {
        placeholder: "Escribe",
        label: "Descripción"
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
          value: _values[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: "24px",
          isDisabled:
            index !== 0 && submitIsDisabled && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}
