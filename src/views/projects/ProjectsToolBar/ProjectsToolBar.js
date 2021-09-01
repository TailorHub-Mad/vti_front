/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React, { useContext } from "react"
import { Filter } from "../../../components/filters/Filter/Filter"
import { Group } from "../../../components/grouping/Group/Group"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"
import { Context } from "../../../context"
import { AddNewProject } from "../AddNewProjectModal/AddNewProject"

export const ProjectsToolBar = () => {
  const {
    state: { role },
  } = useContext(Context)

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

      {role === "ADMIN" && (
        <>
          <Button variant="icon_only_secondary" marginRight="16px">
            <UploadCloudIcon />
          </Button>
          <AddNewProject />
        </>
      )}
    </>
  )
}
