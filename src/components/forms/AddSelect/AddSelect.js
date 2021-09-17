import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { FormController } from "../FormItemWrapper/FormController"
import { InputSelect } from "../InputSelect/InputSelect"

//TODO los botones de añadir y eliminar items podrían ser una variant de Button "aux"
export const AddSelect = ({
  value = [""],
  placeholder,
  onChange,
  additemlabel,
  deleteItemLabel,
  options = [],
  label,
  onHelperClick,
  isDisabled,
  ...props
}) => {
  const [values, setValues] = useState(value)
  // const handleAvailableOptions = (current) =>
  //   options.filter(
  //     (option) => option.value === current || !values.includes(option.value)
  //   )

  const handleChange = (option, idx) => {
    const selected = options?.find(({ value }) => value == option)
    onChange && onChange(selected?.value)
    const nextOptions = [...values]
    nextOptions[idx] = selected.label
    setValues(nextOptions)
  }

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
              options={options}
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
