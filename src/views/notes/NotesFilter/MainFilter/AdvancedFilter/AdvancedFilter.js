import { Button, Flex, Grid, Input, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { InputSelect } from "../../../../../components/forms/InputSelect/InputSelect"

export const AdvancedFilter = () => {
  const symbols = ["(", ")", "&", "||", "Not"]
  const criteria = [
    { value: "project", label: "Proyecto" },
    { value: "test_system", label: "Sistema de ensayo" },
    { value: "project_tag", label: "Tag de proyecto" },
    { value: "note_tag", label: "Tag de apunte" }
  ]

  const [value, setValue] = useState("")

  const handleOnClickSymbol = (symbol) => {
    setValue(value + symbol)
  }

  return (
    <>
      <Text variant="d_s_medium" mb="2px">
        Escriba o seleccione una combinación
      </Text>
      <Input
        placeholder={`TAproy:GOM&((TagAp:Incidencias))`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Text
        variant="d_xs_regular"
        color="grey"
      >{`Ejemplo TagProy:GOM & ((TagAp:Incidencias & TagAp:clientes) || Riesgos)`}</Text>

      <Text variant="d_s_medium" mb="2px" mt="16px">
        Seleccione símbolo
      </Text>
      <Grid templateColumns="repeat(5, 36px)" gap="8px">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            variant="filter_button"
            onClick={() => handleOnClickSymbol(symbol)}
          >
            {symbol}
          </Button>
        ))}
      </Grid>
      <Text variant="d_s_medium" mb="2px" mt="16px">
        Seleccione el criterio a añadir
      </Text>
      <InputSelect
        options={criteria}
        placeholder="Seleccione tipo de criterio"
        mb="8px"
      />
      <InputSelect
        options={criteria}
        placeholder="Seleccione valor"
        mb="8px"
        isDisabled
      />
      <Flex>
        <Input placeholder="Escriba" />{" "}
        <Button
          variant="filter_button"
          ml="8px"
          width="48px"
          maxWidth="48px"
          maxHeight="48px"
          height="48px"
          fontSize="20px"
        >
          +
        </Button>
      </Flex>
    </>
  )
}
