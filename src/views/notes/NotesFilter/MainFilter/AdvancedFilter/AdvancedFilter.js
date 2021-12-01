import { Button, Flex, Grid, Input, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { InputSelect } from "../../../../../components/forms/InputSelect/InputSelect"
import { SENTENCE_REGEX } from "../../../../../utils/functions/filter"

export const AdvancedFilter = ({
  criteria,
  onChange,
  errorComplexFilter,
  filterComplexValues
}) => {
  const symbols = ["(", ")", "&", "||"]

  const [criterio, setCriterio] = useState("")
  const [isCriterioBoolean, setIsCriterioBoolean] = useState(false)
  const isAddButtonDisabled = SENTENCE_REGEX.test(criterio)

  const isNotButtonDisabled = isCriterioBoolean || !/[a-z0-9]*:/gi.test(criterio)

  const addFirstSentencePart = (substr) => {
    if (!criterio) {
      return `${substr}:`
    }
    const parts = criterio.match(/[a-z0-9]*:/gi)
    if (parts?.length > 0) {
      return criterio.replace(/[a-z0-9]*:/gi, `${substr}:`)
    }
    return `${substr}:`
  }

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
        <Text variant="d_s_regular" cursor="pointer" color="error" mt="4px">
          {errorComplexFilter}
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
              ((idx === 2 || idx === 3) &&
                (!filterComplexValues ||
                  ["(", "&", "|"].includes(
                    filterComplexValues[filterComplexValues.length - 1]
                  ))) ||
              (idx === 0 &&
                filterComplexValues &&
                [")"].includes(
                  filterComplexValues[filterComplexValues.length - 1]
                )) ||
              (idx === 1 &&
                filterComplexValues &&
                ["(", "&", "|"].includes(
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
            <Button
              disabled={isNotButtonDisabled}
              variant="filter_button"
              mr="8px"
              width="48px"
              maxWidth="48px"
              maxHeight="48px"
              height="48px"
              fontSize="16px"
              onClick={() => {
                if (criterio.includes("NOT:")) {
                  setCriterio(criterio.split("NOT:").join(""))
                  return
                }
                const parts = criterio.split(":")
                if (parts[1]) {
                  setCriterio(`${parts[0]}:NOT:${parts[1]}`)
                  return
                }
                setCriterio(`${parts[0]}:NOT:`)
              }}
            >
              NOT
            </Button>
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
      <Text
        mt="8px"
        variant="d_xs_regular"
        color="blue.500"
      >{`Ejemplos: TagAp:"Test" , TagProy:NOT:"Pro", Cerrado:true`}</Text>
    </>
  )
}
