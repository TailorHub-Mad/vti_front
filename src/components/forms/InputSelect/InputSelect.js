import { Box, Input, useOutsideClick } from "@chakra-ui/react"
import React, { useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { FormController } from "../FormItemWrapper/FormController"
import { SelectMenu } from "../SelectMenu/SelectMenu"

export const InputSelect = ({
  value = "",
  onChange,
  placeholder,
  options = [],
  label,
  helper,
  onHelperClick,
  isDisabled,
  ...props
}) => {
  const [showSelectMenu, setShowSelectMenu] = useState(false)
  const [availableOptions, setAvailableOptions] = useState(options)
  const ref = useRef(null)
  const handleChange = (e) => {
    onChange && onChange(e.target.value)
    filterOptions(e.target.value)
  }

  console.log("le llega el value", value)

  const handleSelect = (_value) => {
    const [selected] = availableOptions?.filter((option) => option.value === _value)
    onChange && onChange(selected.label)
    setShowSelectMenu(false)
  }

  const filterOptions = (_value) => {
    const nextOptions = [...options]?.filter((option) =>
      option.label.toLowerCase().includes(_value.toLowerCase())
    )
    setAvailableOptions(nextOptions)
  }

  const handleOnClickInput = () => setShowSelectMenu(!showSelectMenu)

  useOutsideClick({
    ref: ref,
    handler: () => setShowSelectMenu(false),
  })

  useEffect(() => {
    if (!options.length > 0) return
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
      <Box position="relative" ref={ref} {...props}>
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          onClick={handleOnClickInput}
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
          onClick={handleOnClickInput}
        />

        {showSelectMenu && (
          <SelectMenu options={availableOptions} onSelect={handleSelect} />
        )}
      </Box>
    </FormController>
  )
}
