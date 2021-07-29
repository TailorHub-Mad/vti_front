/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React from "react"
import { AddClientIcon } from "../../../components/icons/AddClientIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const ClientsToolBar = () => {
  return (
    <>
      <InputGroup width="196px" marginRight="16px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray" />}
        />
        <Input
          placeholder="Busque por ID, Alias..."
          paddingLeft="40px"
          variant="white"
        />
      </InputGroup>
      <Button variant="icon_only_secondary" marginRight="16px">
        <UploadCloudIcon />
      </Button>
      <Button>
        <AddClientIcon marginRight="8px" />
        Añadir cliente
      </Button>
    </>
  )
}
