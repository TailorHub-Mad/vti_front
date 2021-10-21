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
  isDisabled: inputDisabled,
  isReset,
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
    const nextOptions = options?.filter(
      (option) => !valuesSelected.includes(option.value)
    )

    setAvailableOptions(nextOptions)
  }, [inputValues])

  useEffect(() => {
    if (!isReset) return
    setInputValues([{ label: "", value: "" }])
  }, [isReset])

  useEffect(() => {
    const valuesSelected = inputValues.map((inputValue) => inputValue?.value)
    const nextOptions = options?.filter(
      (option) => !valuesSelected.includes(option.value)
    )

    setAvailableOptions(nextOptions)
  }, [options])

  const renderDeleteItem = (itemPosition) => {
    if (inputDisabled) return null
    if (inputValues.length === 1 && inputValues[0]?.value === "") return null

    const handleOnClick = () => {
      const newValues = [...inputValues].filter((_, index) => itemPosition !== index)
      const checkValues =
        newValues.length === 0 ? [{ label: "", value: "" }] : newValues

      setInputValues(checkValues)
      onChange(checkValues)
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
    if (inputDisabled) return null
    if (inputValues.length > 1 && itemPosition !== inputValues.length - 1)
      return null
    if (inputValues.length === options?.length) return null

    const handleOnClick = () => setInputValues([...inputValues, undefined])

    const isDisabled = inputValues.length === 1 && inputValues[0]?.value === ""

    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          marginTop="8px"
          cursor={isDisabled ? "default" : "pointer"}
          onClick={handleOnClick}
          pointerEvents={isDisabled ? "none" : "all"}
        >
          <AddIcon
            marginRight="4px"
            width="16px"
            color={isDisabled ? "grey" : "blue.500"}
          />
          <Text
            marginTop="4px"
            display="block"
            variant="m_xs_regular"
            color={isDisabled ? "grey" : "blue.500"}
          >
            {additemlabel || "Añadir"}
          </Text>
        </Box>
      </>
    )
  }

  return (
    <FormController label={label} {...props} isDisabled={inputDisabled}>
      <Box>
        {inputValues.map((value, idx) => {
          return (
            <Box key={`${value}-${idx}`} marginBottom="16px">
              <InputSelect
                value={value}
                onChange={(selected) => handleChange(selected, idx)}
                placeholder={placeholder}
                options={availableOptions}
                isDisabled={inputDisabled || availableOptions.length === 0}
              />
              <>
                {options && (
                  <>
                    {renderDeleteItem(idx)} {renderAddItem(idx)}
                  </>
                )}
              </>
            </Box>
          )
        })}
      </Box>
    </FormController>
  )
}
