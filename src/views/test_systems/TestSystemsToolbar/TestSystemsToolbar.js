/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React, { useContext } from "react"
import { CloudButton } from "../../../components/buttons/CloudButton/CloudButton"
import { Filter } from "../../../components/filters/Filter/Filter"
import { Group } from "../../../components/grouping/Group/Group"
import { AddTestSystemIcon } from "../../../components/icons/AddTestSystemIcon"
import { ApiUserContext } from "../../../provider/ApiAuthProvider"

export const TestSystemsToolbar = ({
  onAddTestSystem,
  onSearch,
  onImport,
  onExport,
}) => {
  const { role } = useContext(ApiUserContext)

  return (
    <>
      <Filter />
      <Group />
      <InputGroup width="196px" marginRight="16px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray" />}
        />
        <Input
          placeholder="Busque por ID, código"
          paddingLeft="40px"
          variant="white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
      {role === "admin" && (
        <>
          <CloudButton onImport={onImport} onExport={onExport} />

          <Button onClick={onAddTestSystem}>
            <AddTestSystemIcon marginRight="8px" />
            Añadir sistema
          </Button>
        </>
      )}
    </>
  )
}
