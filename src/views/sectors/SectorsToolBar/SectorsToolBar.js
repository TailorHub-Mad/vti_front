/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React from "react"
import { AddSectorIcon } from "../../../components/icons/AddSectorIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const SectorsToolBar = ({ onAddSector, onSearch }) => {
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
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
      <Button variant="icon_only_secondary" marginRight="16px">
        <UploadCloudIcon />
      </Button>
      <Button onClick={onAddSector}>
        <AddSectorIcon marginRight="8px" />
        Añadir sector
      </Button>
    </>
  )
}
