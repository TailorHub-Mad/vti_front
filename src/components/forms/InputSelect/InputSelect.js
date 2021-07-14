import { Box, Input, useOutsideClick } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { ChevronDownIcon } from "../../icons/ChevronDownIcon"
import { SelectMenu } from "../SelectMenu/SelectMenu"

export const InputSelect = ({ value = "", onChange, placeholder, options = [], ...props }) => {
  const [showSelectMenu, setShowSelectMenu] = useState(false)
  const [availableOptions, setAvailableOptions] = useState(options)
  const ref = useRef(null)
  const handleChange = (e) => {
    onChange(e.target.value)
    filterOptions(e.target.value)
  }

  const handleSelect = (_value) => {
    const [selected] = availableOptions?.filter((option) => option.value === _value)
    onChange(selected.label)
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
    handler: () => setShowSelectMenu(false),
  })

  return (
    <Box position="relative" ref={ref} {...props}>
      <Input
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        onClick={() => setShowSelectMenu(true)}
      />
      <ChevronDownIcon
        position="absolute"
        right="16px"
        top="10px"
        width="24px"
        transform={`rotateZ(${showSelectMenu ? "180" : "0"}deg)`}
      />

      {showSelectMenu && (
        <SelectMenu options={availableOptions} onSelect={handleSelect} />
      )}
    </Box>
  )
}
