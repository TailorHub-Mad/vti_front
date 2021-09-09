import React from "react"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"

export const NewDepartmentForm = ({ value, onChange }) => {
  const formInputs = {
    id: {
      type: "text",
      config: {
        placeholder: "ID",
        label: "ID",
      },
    },
    name: {
      type: "text",
      config: {
        placeholder: "Departamento",
        label: "Departamento",
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
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: name === "name" ? "0" : "24px",
          key: `${name}-${index}`,
          // isDisabled: idx !== 0 && !value[Object.keys(value)[idx - 1]],
          //TODO Check para que sea secuencial el form (disable next step hasta que esté ok el previo)
          ...config,
        })
      })}
    </>
  )
}
