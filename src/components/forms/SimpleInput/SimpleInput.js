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
  isDisabled = false,
  type = "text",
  ...props
}) => {
  // const [activeDate, setActiveDate] = useState(false)

  return (
    <FormController
      label={label}
      helper={helper}
      onHelperClick={onHelperClick}
      isDisabled={isDisabled}
      {...props}
    >
      <Input
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        // value={activeDate && defaultValue ? defaultValue : value}
        type={type}
        // onClick={() => setActiveDate(true)}
      />
    </FormController>
  )
}
