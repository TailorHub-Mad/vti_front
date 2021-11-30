import { Button, Flex, Grid, Input, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { InputSelect } from "../../../../../components/forms/InputSelect/InputSelect"

export const AdvancedFilter = ({
  criteria,
  onChange,
  errorComplexFilter,
  filterComplexValues
}) => {
  const symbols = ["(", ")", "&", "||", "NOT"]

  const [criterio, setCriterio] = useState("")
  const [isCriterioBoolean, setIsCriterioBoolean] = useState(false)

  return (
    <>
      <Text variant="d_s_medium" mb="2px">
        Escriba o seleccione una combinación
      </Text>
      <Input
        placeholder={`TAproy:GOM&((TagAp:Incidencias))`}
        value={filterComplexValues || ""}
        onChange={(e) => onChange(e?.target?.value)}
        color={errorComplexFilter ? "error" : null}
      />
      {errorComplexFilter ? (
        <Text variant="d_xs_regular" cursor="pointer" color="error">
          La sintaxis no es correcta
        </Text>
      ) : (
        <>
          <Text mt="8px" variant="d_xs_regular" color="blue.500">{`Ejemplos:`}</Text>
          <Text
            variant="d_xs_regular"
            color="blue.500"
          >{`Formalizado:true&AliasProy:"AliasProyecto"`}</Text>
          <Text
            variant="d_xs_regular"
            color="blue.500"
          >{`TagAp:NOT:"Acta"||Formalizado:false`}</Text>
          <Text
            variant="d_xs_regular"
            color="blue.500"
          >{`(TagAp:"Incidencias"&TagAp:"Subconjunto")||AliasSis:"MedVel_ADD_7"`}</Text>
        </>
      )}

      <Text variant="d_s_medium" mb="2px" mt="16px">
        Seleccione símbolo
      </Text>
      <Grid templateColumns="repeat(5, 36px)" gap="8px">
        {symbols.map((symbol) => (
          <Button
            key={symbol}
            variant="filter_button"
            onClick={() =>
              onChange(filterComplexValues ? filterComplexValues + symbol : symbol)
            }
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
        onChange={(option) => {
          setIsCriterioBoolean(option.isBoolean)
          onChange(
            filterComplexValues
              ? filterComplexValues + `${option.value}:`
              : `${option.value}:`
          )
        }}
      />
      <Flex>
        {isCriterioBoolean ? (
          <InputSelect
            options={[
              { label: "Si", value: true },
              { label: "No", value: false }
            ]}
            placeholder="Selecciona valor"
            mb="8px"
            onChange={(option) => {
              onChange(
                filterComplexValues
                  ? filterComplexValues + `${option.value}`
                  : `${option.value}`
              )
            }}
          />
        ) : (
          <>
            <Input
              placeholder="Escriba"
              value={criterio}
              onChange={(e) => setCriterio(e.target.value)}
            />
            <Button
              variant="filter_button"
              ml="8px"
              width="48px"
              maxWidth="48px"
              maxHeight="48px"
              height="48px"
              fontSize="20px"
              onClick={() => {
                onChange(
                  filterComplexValues
                    ? filterComplexValues + `"${criterio}"`
                    : `"${criterio}"`
                )
                setCriterio("")
              }}
            >
              +
            </Button>
          </>
        )}
      </Flex>
    </>
  )
}
