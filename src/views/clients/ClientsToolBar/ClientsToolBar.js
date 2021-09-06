/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React from "react"
import { AddClientIcon } from "../../../components/icons/AddClientIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const ClientsToolBar = ({ onAddClient, onSearch }) => {
  return (
    <Flex>
      <InputGroup width="196px" marginRight="16px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray" />}
        />
        <Input
          placeholder="Busque por ID, Alias..."
          paddingLeft="40px"
          variant="white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
      <Button variant="icon_only_secondary" marginRight="16px">
        <UploadCloudIcon />
      </Button>
      <Button onClick={onAddClient}>
        <AddClientIcon marginRight="8px" />
        Añadir cliente
      </Button>
    </Flex>
  )
}
