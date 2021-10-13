import { Box, Flex } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FormController } from "../FormItemWrapper/FormController"
import { InputSelect } from "../InputSelect/InputSelect"
import { CloseIcon } from "../../icons/CloseIcon"
import { Tag } from "../../tags/tag/tag"

export const MultiTagSelect = ({
  value = [{ label: "", value: "" }],
  options = [],
  onChange = () => {},
  label,
  placeholder,
  isDisabled,
  ...props
}) => {
  const [inputValues, setInputValues] = useState(value)
  const [availableOptions, setAvailableOptions] = useState([])

  const handleChange = (option) => {
    const newInputValues = [...inputValues]
    newInputValues.push(option)
    setInputValues(newInputValues)
    onChange(newInputValues)
  }
  const handleDeleteItem = (idx) => {
    const _items = inputValues.filter((_, index) => index !== idx)
    setInputValues(_items)
    onChange(_items)
  }

  useEffect(() => {
    setAvailableOptions(options)
  }, [options])

  useEffect(() => {
    const valuesSelected = inputValues.map((inputValue) => inputValue?.value)
    const availableOptions = options?.filter(
      (option) => !valuesSelected.includes(option.value)
    )

    setAvailableOptions(availableOptions)
  }, [inputValues])

  return (
    <FormController label={label} {...props} isDisabled={isDisabled}>
      <Box>
        <InputSelect
          onChange={(selected) => handleChange(selected)}
          placeholder={placeholder}
          options={availableOptions}
          isDisabled={isDisabled}
        />
        <Flex mt="12px" width="100%" wrap="wrap" height="fit-content">
          {inputValues.map((value, idx) => {
            return (
              value.value && (
                <Tag
                  key={`${value.value}-${idx}`}
                  variant="pale_yellow"
                  mb="8px"
                  mr="8px"
                  height="32px"
                >
                  {value.label}{" "}
                  <CloseIcon
                    width="16px"
                    cursor="pointer"
                    onClick={() => handleDeleteItem(idx)}
                  />{" "}
                </Tag>
              )
            )
          })}
        </Flex>
      </Box>
    </FormController>
  )
}
