/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React from "react"
import { Filter } from "../../../components/filters/Filter/Filter"
import { Group } from "../../../components/grouping/Group/Group"
import { AddNoteIcon } from "../../../components/icons/AddNoteIcon"
import { AddProjectIcon } from "../../../components/icons/AddProjectIcon"
import { NotesIcon } from "../../../components/icons/NotesIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const ProjectsToolBar = () => {
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
          placeholder="Busque por ID, Alias"
          paddingLeft="40px"
          variant="white"
        />
      </InputGroup>
      <Button variant="icon_only_secondary" marginRight="16px">
        <UploadCloudIcon />
      </Button>
      <Button>
        <AddProjectIcon marginRight="8px" />
        Añadir proyecto
      </Button>
    </>
  )
}
