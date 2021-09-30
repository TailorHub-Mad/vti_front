import { FormLabel } from "@chakra-ui/form-control"
import { Flex } from "@chakra-ui/layout"
import React from "react"
import { FileInput } from "../../../../components/forms/FileInput/FileInput"
import { SimpleInput } from "../../../../components/forms/SimpleInput/SimpleInput"
import { TextAreaInput } from "../../../../components/forms/TextAreaInput/TextAreaInput"

export const ResponseForm = ({ value, onChange, submitIsDisabled }) => {
  const handleFormChange = (input, _value) => {
    onChange({
      ...value,
      [input]: _value
    })
  }

  const formInputs = {
    message: {
      type: "textArea",
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
    file: {
      type: "attachment",
      config: {
        label: "Adjunta tus documentos"
      }
    }
  }

  const inputRefObj = {
    text: <SimpleInput />,
    textArea: <TextAreaInput />,
    attachment: <FileInputForm />
  }

  return (
    <>
      {Object.entries(formInputs).map(([name, { type, config }], index) => {
        return React.cloneElement(inputRefObj[type], {
          value: value[name],
          onChange: (val) => handleFormChange(name, val),
          marginBottom: name === "name" ? "0" : "24px",
          isDisabled:
            index !== 0 && submitIsDisabled && !value[Object.keys(value)[index - 1]],
          key: `${name}-${index}`,
          ...config
        })
      })}
    </>
  )
}

const FileInputForm = ({ value, onChange, isDisabled }) => {
  return (
    <Flex flexDirection="column" mb="24px">
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
    </Flex>
  )
}
