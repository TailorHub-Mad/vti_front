/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React, { useContext } from "react"
import { Filter } from "../../../components/filters/Filter/Filter"
import { Group } from "../../../components/grouping/Group/Group"
import { AddTestSystemIcon } from "../../../components/icons/AddTestSystemIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"
import { ApiUserContext } from "../../../provider/ApiAuthProvider"

export const TestSystemsToolbar = () => {
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
        />
      </InputGroup>
      {role === "admin" && (
        <>
          <Button variant="icon_only_secondary" marginRight="16px">
            <UploadCloudIcon />
          </Button>
          <Button>
            <AddTestSystemIcon marginRight="8px" />
            Añadir sistema
          </Button>
        </>
      )}
    </>
  )
}
