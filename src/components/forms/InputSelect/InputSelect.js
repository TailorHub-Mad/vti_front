import { Box, Input, useOutsideClick } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { FormController } from "../FormItemWrapper/FormController"
import { SelectMenu } from "../SelectMenu/SelectMenu"

export const InputSelect = ({
  value = { label: "", valule: "" },
  options = [],
  onChange,
  label,
  placeholder,
  helper,
  onHelperClick,
  isDisabled = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value.label)
  const [showSelectMenu, setShowSelectMenu] = useState(false)
  const [availableOptions, setAvailableOptions] = useState(options)

  const ref = useRef(null)

  const handleChange = (e) => {
    const targetValue = e.target.value
    setInputValue(targetValue)

    if (targetValue === "") return setAvailableOptions(options)
    return filterOptions(targetValue)
  }

  const handleSelect = (_value) => {
    const selected = availableOptions?.find((option) => option.value === _value)

    onChange(selected)
    setInputValue(selected?.label)
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
    setInputValue(value.label)
  }, [value])

  useEffect(() => {
    setAvailableOptions(options)
  }, [options])

  return (
    <FormController
      label={label}
      helper={helper}
      onHelperClick={onHelperClick}
      isDisabled={isDisabled}
      {...props}
    >
      <Box
        position="relative"
        ref={ref}
        {...props}
        pointerEvents={isDisabled ? "none" : "all"}
      >
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          onClick={() => setShowSelectMenu(true)}
          value={inputValue}
          isDisabled={isDisabled}
          _loading
        />
        <ChevronDownIcon
          position="absolute"
          right="16px"
          top="10px"
          width="24px"
          opacity={isDisabled ? 0.3 : 1}
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
