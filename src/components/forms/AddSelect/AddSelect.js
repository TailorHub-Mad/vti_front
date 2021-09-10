import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { FormController } from "../FormItemWrapper/FormController"
import { InputSelect } from "../InputSelect/InputSelect"

//TODO los botones de añadir y eliminar items podrían ser una variant de Button "aux"
export const AddSelect = ({
  value,
  // name,
  placeholder,
  // errors,
  onChange,
  additemlabel,
  deleteItemLabel,
  options = [],
  label,
  onHelperClick,
  isDisabled,
  ...props
}) => {
  const [values, setValues] = useState(value && Array.isArray(value) ? value : [""])
  const handleAvailableOptions = (current) =>
    options.filter(
      (option) => option.value === current || !values.includes(option.value)
    )

  // const error = errors && errors[name]?.type

  const handleChange = (option, idx) => {
    const nextOptions = [...values]
    nextOptions[idx] = option
    setValues(nextOptions)
  }

  useEffect(() => {
    onChange && onChange(values)
  }, [values])

  return (
    <FormController
      label={label}
      onHelperClick={onHelperClick}
      isDisabled={isDisabled}
      {...props}
    >
      <Box>
        {values.map((val, idx) => (
          <Box key={`${val}-${idx}`} marginBottom="16px">
            <InputSelect
              value={val}
              onChange={(option) => handleChange(option, idx)}
              placeholder={placeholder}
              options={handleAvailableOptions(val)}
              isDisabled={isDisabled}
            />
            {idx !== 0 ? (
              <Box
                display="flex"
                alignItems="center"
                marginTop="8px"
                cursor="pointer"
                onClick={() =>
                  setValues([...values].filter((_, index) => idx !== index))
                }
              >
                <DeleteIcon marginRight="4px" width="16px" color="error" />
                <Text
                  marginTop="4px"
                  display="block"
                  variant="m_xs_regular"
                  color="error"
                >
                  {deleteItemLabel || "Eliminar"}
                </Text>
              </Box>
            ) : (
              <>
                {values.length < options.length ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    marginTop="8px"
                    cursor="pointer"
                    pointerEvents={
                      values.length >= 1 && values[0] !== "" ? "auto" : "none"
                    }
                    onClick={() => setValues(["", ...values])}
                    opacity={values.length >= 1 && values[0] !== "" ? "1" : "0.3"}
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
                ) : null}
              </>
            )}
          </Box>
        ))}
      </Box>
    </FormController>
  )
}
