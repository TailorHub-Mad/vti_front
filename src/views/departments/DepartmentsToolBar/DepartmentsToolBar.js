/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from "@chakra-ui/react"
import React from "react"
import { CloudButton } from "../../../components/buttons/CloudButton/CloudButton"
import { AddDepartmentIcon } from "../../../components/icons/AddDepartmentIcon"
import { AddSectorIcon } from "../../../components/icons/AddSectorIcon"
import { UploadCloudIcon } from "../../../components/icons/UploadCloudIcon"

export const DepartmentsToolBar = ({
  onAddDepartment,
  onSearch,
  onImport,
  onExport,
}) => {
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
      <CloudButton onImport={onImport} onExport={onExport} />
      <Button onClick={onAddDepartment}>
        <AddDepartmentIcon marginRight="8px" />
        Añadir departamento
      </Button>
    </>
  )
}