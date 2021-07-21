/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React from "react"
import { Filter } from "../../../components/filters/Filter/Filter"
import { AddNoteIcon } from "../../../components/icons/AddNoteIcon"
import { NotesIcon } from "../../../components/icons/NotesIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const NotesToolBar = () => {
  return (
    <>
      <Filter />
      <Button variant="tool_button" marginRight="16px">
        <NotesIcon marginRight="8px" />
        Agrupar
      </Button>
      <InputGroup width="196px" marginRight="16px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray" />}
        />
        <Input
          placeholder="Busque por ID, proyecto"
          paddingLeft="40px"
          variant="white"
        />
      </InputGroup>
      <Button variant="icon_only_secondary" marginRight="16px">
        <UploadCloudIcon />
      </Button>
      <Button>
        <AddNoteIcon marginRight="8px" />
        Añadir apunte
      </Button>
    </>
  )
}
