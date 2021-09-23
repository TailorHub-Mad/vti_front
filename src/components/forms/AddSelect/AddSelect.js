import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FormController } from "../FormItemWrapper/FormController"
import { InputSelect } from "../InputSelect/InputSelect"

export const AddSelect = ({
  value = [{ label: "", value: "" }],
  options = [],
  onChange = () => {},
  label,
  placeholder,
  additemlabel,
  deleteItemLabel,
  isDisabled,
  ...props
}) => {
  const [inputValues, setInputValues] = useState(value)
  const [availableOptions, setAvailableOptions] = useState([])

  const handleChange = (option, idx) => {
    const newInputValues = [...inputValues]
    newInputValues[idx] = option

    setInputValues(newInputValues)
    onChange(newInputValues)
  }

  useEffect(() => {
    setAvailableOptions(options)
  }, [options])

  useEffect(() => {
    const valuesSelected = inputValues.map((inputValue) => inputValue?.value)
    const availableOptions = options.filter(
      (option) => !valuesSelected.includes(option.value)
    )

    setAvailableOptions(availableOptions)
  }, [inputValues])

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
    <FormController label={label} {...props}>
      <Box>
        {inputValues.map((value, idx) => {
          return (
            <Box key={`${value}-${idx}`} marginBottom="16px">
              <InputSelect
                value={value}
                onChange={(selected) => handleChange(selected, idx)}
                placeholder={placeholder}
                options={availableOptions}
                isDisabled={isDisabled}
              />
              <>
                {renderDeleteItem(idx)}
                {renderAddItem(idx)}
              </>
            </Box>
          )
        })}
      </Box>
    </FormController>
  )
}
