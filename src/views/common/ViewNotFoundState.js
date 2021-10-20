import { Center, Text, Button } from "@chakra-ui/react"
import React from "react"

export const ViewNotFoundState = ({ text, backText, onClick, noBack, ...props }) => {
  return (
    <Center flexDir="column" h="80vh" {...props}>
      <Text variant="d_s_medium" mb="24px" color="grey">
        {text || "No se ha encontrado ningún resultado"}
      </Text>
      {noBack || <Button onClick={onClick}>{backText || "Volver"}</Button>}
    </Center>
  )
}
