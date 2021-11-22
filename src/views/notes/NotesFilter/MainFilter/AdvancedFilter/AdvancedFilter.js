import { Button, Flex, Grid, Input, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { InputSelect } from "../../../../../components/forms/InputSelect/InputSelect"

export const AdvancedFilter = ({
  criteria,
  onChange,
  errorComplexFilter,
  filterComplexValues
}) => {
  const symbols = ["(", ")", "&", "||", "Not"]

  const [value, setValue] = useState(filterComplexValues)
  const [criterio, setCriterio] = useState("")

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <>
      <Text variant="d_s_medium" mb="2px">
        Escriba o seleccione una combinación
      </Text>
      <Input
        placeholder={`TAproy:GOM&((TagAp:Incidencias))`}
        value={filterComplexValues || ""}
        onChange={(e) => setValue(e.target.value)}
        color={errorComplexFilter ? "error" : null}
      />
      {errorComplexFilter ? (
        <Text variant="d_xs_regular" cursor="pointer" color="error">
          La sintaxis no es correcta
        </Text>
      ) : (
        <Text
          variant="d_xs_regular"
          color="grey"
        >{`Ejemplo TagProy:GOM & ((TagAp:Incidencias & TagAp:clientes) || Riesgos)`}</Text>
      )}

      <Text variant="d_s_medium" mb="2px" mt="16px">
        Seleccione símbolo
      </Text>
      <Grid templateColumns="repeat(5, 36px)" gap="8px">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            variant="filter_button"
            onClick={() => setValue(value + symbol)}
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
        onChange={(option) => setValue(value + `${option.value}:`)}
      />
      <Flex>
        <Input
          placeholder="Escriba"
          value={criterio}
          onChange={(e) => setCriterio(e.target.value)}
        />{" "}
        <Button
          variant="filter_button"
          ml="8px"
          width="48px"
          maxWidth="48px"
          maxHeight="48px"
          height="48px"
          fontSize="20px"
          onClick={() => {
            setValue(value + `"${criterio}"`)
            setCriterio("")
          }}
        >
          +
        </Button>
      </Flex>
    </>
  )
}
