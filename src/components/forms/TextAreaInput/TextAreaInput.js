import { Textarea } from "@chakra-ui/react"
import React from "react"
import { FormController } from "../FormItemWrapper/FormController"

export const TextAreaInput = ({
  value = "",
  onChange,
  placeholder = "",
  label,
  helper,
  onHelperClick,
  isDisabled = false,
  ...props
}) => {
  return (
    <FormController
      label={label}
      helper={helper}
      onHelperClick={onHelperClick}
      isDisabled={isDisabled}
      {...props}
    >
      <Textarea
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value || ""}
      />
    </FormController>
  )
}
