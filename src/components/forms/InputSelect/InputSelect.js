import { Box, Input, useOutsideClick } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { FormController } from "../FormItemWrapper/FormController"
import { SelectMenu } from "../SelectMenu/SelectMenu"

export const InputSelect = ({
  value = undefined,
  options = [],
  onChange,
  label,
  placeholder,
  helper,
  onHelperClick,
  isDisabled = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [showSelectMenu, setShowSelectMenu] = useState(false)
  const [availableOptions, setAvailableOptions] = useState(options)
  const [disabledInput, setDisabledInput] = useState(isDisabled)

  console.log("inputValue", inputValue)

  const ref = useRef(null)

  const handleChange = (e) => {
    const targetValue = e.target.value
    setInputValue(targetValue)

    if (targetValue === "") return setAvailableOptions(options)
    return filterOptions(targetValue)
  }

  const handleSelect = (_value) => {
    const [selected] = availableOptions?.filter((option) => option.value === _value)

    onChange(selected)
    setInputValue(selected?.label)
    setAvailableOptions(options)
    setShowSelectMenu(false)
  }

  const filterOptions = (_value) => {
    const nextOptions = [...options]?.filter((option) =>
      option.label.toLowerCase().includes(_value.toLowerCase())
    )

    setAvailableOptions(nextOptions)
  }

  useOutsideClick({
    ref: ref,
    handler: () => setShowSelectMenu(false)
  })

  useEffect(() => {
    if (!value) return
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (value && options.length === 0) return setDisabledInput(true)
    setAvailableOptions(options)
  }, [options])

  return (
    <FormController
      label={label}
      helper={helper}
      onHelperClick={onHelperClick}
      isDisabled={disabledInput}
      {...props}
    >
      <Box
        position="relative"
        ref={ref}
        {...props}
        pointerEvents={disabledInput ? "none" : "all"}
      >
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          onClick={() => setShowSelectMenu(true)}
          value={inputValue}
          isDisabled={disabledInput}
          _loading
        />
        <ChevronDownIcon
          position="absolute"
          right="16px"
          top="10px"
          width="24px"
          opacity={disabledInput ? 0.3 : 1}
          transform={`rotateZ(${showSelectMenu ? "180" : "0"}deg)`}
          cursor="pointer"
          onClick={() => setShowSelectMenu(!showSelectMenu)}
        />

        {showSelectMenu && (
          <SelectMenu options={availableOptions} onSelect={handleSelect} />
        )}
      </Box>
    </FormController>
  )
}
