/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import { Button, Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import React, { useContext } from "react"
import { CloudButton } from "../../../components/buttons/CloudButton/CloudButton"
import { Filter } from "../../../components/filters/Filter/Filter"
import { Group } from "../../../components/grouping/Group/Group"
import { AddProjectIcon } from "../../../components/icons/AddProjectIcon"
import { ApiUserContext } from "../../../provider/ApiAuthProvider"

export const ProjectsToolBar = ({ onSearch, onImport, onExport, onAddProject, onGroup }) => {
  const { role } = useContext(ApiUserContext)

  return (
    <Flex width="fit-content">
      <Filter />
      <Group onGroup={(activeItem)=>onGroup(activeItem)}/>
      <InputGroup width="196px" marginRight="16px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray" />}
        />
        <Input
          placeholder="Busque por ID, Alias"
          paddingLeft="40px"
          variant="white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>

      {role === "admin" && (
        <>
          <CloudButton onImport={onImport} onExport={onExport} />
          <Button onClick={onAddProject}>
            <AddProjectIcon marginRight="8px" />
            Añadir proyecto
          </Button>
        </>
      )}
    </Flex>
  )
}
