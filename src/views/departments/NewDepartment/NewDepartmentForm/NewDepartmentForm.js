import React from "react"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"

export const NewDepartmentForm = ({ value, onChange }) => {
  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    name: {
      type: "text",
      config: {
        placeholder: "Departamento",
        label: "Departamento"
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
