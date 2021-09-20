import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FormController } from "../FormItemWrapper/FormController"
import { InputSelect } from "../InputSelect/InputSelect"

export const AddSelect = ({
  values = [undefined],
  options = [],
  onChange,
  label,
  placeholder,
  additemlabel,
  deleteItemLabel,
  isDisabled = false,
  ...props
}) => {
  const [inputValues, setInputValues] = useState(values)
  const [disabledInput, setDisabledInput] = useState(isDisabled)

  console.log("inputValues", inputValues)

  const handleAvailableOptions = () => {
    const availableOptions = options.filter(
      (option) => !inputValues.includes(option)
    )

    return availableOptions
  }

  const handleChange = (option, idx) => {
    const selected = options?.find(({ value }) => value == option.value)

    const newInputValues = [...inputValues]

    newInputValues[idx] = selected
    setInputValues(newInputValues)

    onChange(newInputValues)
  }

  useEffect(() => {
    if (options.length === 0) return setDisabledInput(true)
  }, [options])

  const renderDeleteItem = (itemPosition) => {
    if (inputValues.length === 1 && itemPosition === 0) return null
    if (inputValues.length > 1 && itemPosition === inputValues.length - 1)
      return null

    const handleOnClick = () => {
      const newValues = [...inputValues].filter((_, index) => itemPosition !== index)

      setInputValues(newValues)
      onChange(newValues)
    }

    return (
      <Box
        display="flex"
        alignItems="center"
        marginTop="8px"
        cursor="pointer"
        onClick={handleOnClick}
      >
        <DeleteIcon marginRight="4px" width="16px" color="error" />
        <Text marginTop="4px" display="block" variant="m_xs_regular" color="error">
          {deleteItemLabel || "Eliminar"}
        </Text>
      </Box>
    )
  }

  const renderAddItem = (itemPosition) => {
    if (inputValues.length > 1 && itemPosition !== inputValues.length - 1)
      return null
    if (inputValues.length === options.length) return null

    const handleOnClick = () => setInputValues([undefined, ...inputValues])

    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          marginTop="8px"
          cursor="pointer"
          onClick={handleOnClick}
        >
          <AddIcon marginRight="4px" width="16px" color="blue.500" />
          <Text
            marginTop="4px"
            display="block"
            variant="m_xs_regular"
            color="blue.500"
          >
            {additemlabel || "Añadir"}
          </Text>
        </Box>
      </>
    )
  }

  return (
    <FormController label={label} isDisabled={disabledInput} {...props}>
      <Box>
        {inputValues.map((value, idx) => (
          <Box key={`${value}-${idx}`} marginBottom="16px">
            <InputSelect
              value={value?.label}
              onChange={(selected) => handleChange(selected, idx)}
              placeholder={placeholder}
              options={handleAvailableOptions()}
              isDisabled={disabledInput}
            />
            <>
              {renderDeleteItem(idx)}
              {renderAddItem(idx)}
            </>
          </Box>
        ))}
      </Box>
    </FormController>
  )
}
