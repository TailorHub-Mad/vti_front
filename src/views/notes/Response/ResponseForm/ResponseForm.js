import { FormLabel } from "@chakra-ui/form-control"
import React from "react"
import { FileInput } from "../../../../components/forms/FileInput/FileInput"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"

export const ResponseForm = ({ value, onChange }) => {
  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    message: {
      type: "text",
      config: {
        placeholder: "Escribe la respuesta",
        label: "Mensaje*"
      }
    },
    link: {
      type: "text",
      config: {
        placeholder: "Escriba un link",
        label: "Link (opcional)"
      }
    },
    document: {
      type: "attachment",
      config: {
        label: "Adjunta tus documentos",
        isDisabled: true // TODO -> provisional
      }
    }
    // tags: {
    //   type: "add_select",
    //   config: {}
    // }
  }

  const inputRefObj = {
    text: <SimpleInput />,
    attachment: <FileInputForm />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: name === "name" ? "0" : "24px",
          isDisabled: index !== 0 && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}

const FileInputForm = ({ value, onChange, isDisabled }) => {
  return (
    <>
      <FormLabel
        margin="0"
        marginRight="4px"
        display="flex"
        alignItems="center"
        color={isDisabled ? "#E2E8F0" : "#052E57"}
        mb="8px"
      >
        Adjunta tus documentos (opcional)
      </FormLabel>
      <FileInput value={value} onChange={onChange} isDisabled={isDisabled} />
    </>
  )
}
