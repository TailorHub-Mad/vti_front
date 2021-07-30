import { Input } from "@chakra-ui/react"
import React from "react"
import { FormController } from "../FormItemWrapper/FormController"

export const SimpleInput = ({
  value = "",
  onChange,
  placeholder,
  label,
  helper,
  onHelperClick,
  ...props
}) => {
  return (
    <FormController
      label={label}
      helper={helper}
      onHelperClick={onHelperClick}
      {...props}
    >
      <Input
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </FormController>
  )
}
