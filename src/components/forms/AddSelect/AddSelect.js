import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FormController } from "../FormItemWrapper/FormController"
import { InputSelect } from "../InputSelect/InputSelect"

//TODO los botones de añadir y eliminar items podrían ser una variant de Button "aux"
export const AddSelect = ({
  values = [],
  options = [],
  onChange,
  label,
  placeholder,
  additemlabel,
  deleteItemLabel,
  isDisabled,
  ...props
}) => {
  const [inputValues, setInputValues] = useState(values)
  const [availableOptions, setAvailableOptions] = useState(options)
  const [disabledInput, setDisabledInput] = useState(isDisabled)

  // const handleAvailableOptions = (current) =>
  //   options.filter(
  //     (option) => option.value === current || !values.includes(option.value)
  //   )

  const handleChange = (option, idx) => {
    const selected = options?.find(({ value }) => value == option)
    onChange && onChange(selected?.value)
    const nextOptions = [...values]
    nextOptions[idx] = selected.label
    setInputValues(nextOptions)
  }

  useEffect(() => {
    if (options.length === 0) return setDisabledInput(true)
    setAvailableOptions(options)
  }, [options])

  const renderDeleteItem = (itemPosition) => {
    const handleOnClick = () =>
      setInputValues([...values].filter((_, index) => itemPosition !== index))

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

  const renderAddItem = () => {
    const handleOnClick = () => setInputValues(["", ...inputValues])

    const conditionalStyle = inputValues.length >= 1 && inputValues[0] !== ""

    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          marginTop="8px"
          cursor="pointer"
          pointerEvents={conditionalStyle ? "auto" : "none"}
          onClick={handleOnClick}
          opacity={conditionalStyle !== "" ? "1" : "0.3"}
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
              value={value}
              onChange={(selected) => handleChange(selected, idx)}
              placeholder={placeholder}
              options={availableOptions}
              isDisabled={disabledInput}
            />
            {idx !== 0 && renderDeleteItem(idx)}
            {idx === 0 &&
              inputValues.length < options.length &&
              renderAddItem(inputValues)}
          </Box>
        ))}
      </Box>
    </FormController>
  )
}
