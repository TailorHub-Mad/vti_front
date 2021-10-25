import { Input } from "@chakra-ui/react"
import React, { useState } from "react"
import { checkIsYear } from "../../../utils/functions/forms"
import { FormController } from "../FormItemWrapper/FormController"

export const SimpleInput = ({
  value = "",
  onChange,
  placeholder,
  label,
  helper,
  onHelperClick,
  isDisabled = false,
  type = "text",
  isYear,
  ...props
}) => {
  const [hasError, setHasError] = useState(false)

  const handleOnBlur = () => {
    if (!isYear) return
    if (!checkIsYear(value)) return setHasError(true)
    if (hasError) return setHasError(false)
  }

  return (
    <FormController
      label={label}
      helper={helper}
      onHelperClick={onHelperClick}
      isDisabled={isDisabled}
      isInvalid={hasError}
      error={hasError && "El año no es correcto"}
      {...props}
    >
      <Input
        placeholder={placeholder}
        onChange={(e) => {
          checkIsYear(e.target.value)
          onChange(e.target.value)
        }}
        onBlur={handleOnBlur}
        value={value}
        type={type}
      />
    </FormController>
  )
}
