import { Button, Flex, Grid, Input, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { InputSelect } from "../../../../../components/forms/InputSelect/InputSelect"

export const AdvancedFilter = ({
  criteria,
  onChange,
  errorComplexFilter,
  filterComplexValues
}) => {
  const symbols = ["(", ")", "&", "||"]

  const [criterio, setCriterio] = useState("")
  const [isCriterioBoolean, setIsCriterioBoolean] = useState(false)
  const isAddButtonDisabled =
    !filterComplexValues ||
    !["&", "|", "("].includes(filterComplexValues[filterComplexValues.length - 1]) ||
    (!criterio || !criterio?.includes(":") || isCriterioBoolean
      ? !criterio?.includes("true") && !criterio?.includes("false")
      : !criterio?.includes('"'))

  const addFirstSentencePart = (substr) => {
    if (!criterio) {
      return `${substr}:`
    }
    const parts = criterio.split(":")
    return `${substr}:${parts[1]}`
  }

  // const addSecondSentencePart = (substr) => {
  //   if (!criterio) {
  //     return ""
  //   }
  //   return `${criterio}:"${substr}"`
  // }

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
        {symbols.map((symbol, idx) => (
          <Button
            key={symbol}
            disabled={
              (idx === 2 || idx === 3) &&
              (!filterComplexValues ||
                ["(", "&", "|"].includes(
                  filterComplexValues[filterComplexValues.length - 1]
                )) || (idx === 0 || idx === 1) &&
                (filterComplexValues &&
                  ["&", "|"].includes(
                    filterComplexValues[filterComplexValues.length - 1]
                  ))
            }
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
          option.isBoolean
            ? setCriterio(`${option.value}`)
            : setCriterio(addFirstSentencePart(option.value))
        }}
      />
      <Flex>
        {isCriterioBoolean ? (
          <InputSelect
            options={[
              { label: "Si", value: `${criterio}:true` },
              { label: "No", value: `${criterio}:false` }
            ]}
            placeholder="Selecciona valor"
            mb="8px"
            onChange={(option) => setCriterio(option.value)}
          />
        ) : (
          <>
            <Input
              placeholder="Escriba"
              value={criterio}
              onChange={(e) => setCriterio(e.target.value)}
            />
          </>
        )}
        <Button
          disabled={isAddButtonDisabled}
          variant="filter_button"
          ml="8px"
          width="48px"
          maxWidth="48px"
          maxHeight="48px"
          height="48px"
          fontSize="20px"
          onClick={() => {
            onChange(filterComplexValues ? filterComplexValues + criterio : criterio)
            setCriterio("")
          }}
        >
          +
        </Button>
      </Flex>
    </>
  )
}
