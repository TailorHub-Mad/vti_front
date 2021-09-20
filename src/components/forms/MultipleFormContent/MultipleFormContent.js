import { Box, Text, Button } from "@chakra-ui/react"
import React from "react"

export const MultipleFormContent = ({
  values = [],
  onChange = () => {},
  onDelete = () => {},
  addTitle,
  deleteTitle,
  objectToUpdate,
  children
}) => {
  return (
    <>
      {values.map((value, idx) => (
        <Box key={`value-${idx}`}>
          {idx !== 0 ? (
            <Text margin="32px 0" variant="d_l_medium">
              {addTitle || "Añadir"}
            </Text>
          ) : null}
          <>
            {React.cloneElement(children, {
              value: value,
              onChange: (val) => onChange(val, idx),
              objectToUpdate: objectToUpdate
            })}
          </>
          {idx !== 0 ? (
            <Button variant="text_only" color="error" onClick={() => onDelete(idx)}>
              {deleteTitle || "Eliminar"}
            </Button>
          ) : null}
        </Box>
      ))}
    </>
  )
}
