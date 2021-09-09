import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement, Flex } from "@chakra-ui/react"
import React, { useContext } from "react"
import { CloudButton } from "../../buttons/CloudButton/CloudButton"
import { Filter } from "../../filters/Filter/Filter"
import { Group } from "../../grouping/Group/Group"
import { AddTestSystemIcon } from "../../icons/AddTestSystemIcon"
import { ApiUserContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global_config"

export const ToolBar = ({
  onAdd,
  onSearch,
  onImport,
  onExport,
  addLabel,
  searchPlaceholder,
  withoutFilter,
  withoutGroup,
}) => {
  const { role } = useContext(ApiUserContext)

  return (
    <Flex>
      {withoutFilter || <Filter />}
      {withoutGroup || <Group />}
      <InputGroup width="196px" marginRight="16px">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray" />}
        />
        <Input
          placeholder={searchPlaceholder ?? "Busque por ID"}
          paddingLeft="40px"
          variant="white"
          onChange={(e) => onSearch(e.target.value)}
        />
      </InputGroup>
      {role === RoleType.ADMIN && (
        <>
          <CloudButton onImport={onImport} onExport={onExport} />

          <Button onClick={onAdd}>
            <AddTestSystemIcon marginRight="8px" />
            {addLabel ?? "Añadir"}
          </Button>
        </>
      )}
    </Flex>
  )
}
