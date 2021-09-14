import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement, Flex } from "@chakra-ui/react"
import React, { useContext } from "react"
import { CloudButton } from "../../buttons/CloudButton/CloudButton"
import { Filter } from "../../filters/Filter"
import { Group } from "../../grouping/Group"
import { AddProjectIcon } from "../../icons/AddProjectIcon"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global_config"

export const ToolBar = ({
  onAdd,
  onSearch,
  onImport,
  onExport,
  addLabel,
  searchPlaceholder,
  noFilter,
  noGroup,
  icon,
}) => {
  const { role } = useContext(ApiAuthContext)

  return (
    <Flex>
      {noFilter || <Filter />}
      {noGroup || <Group />}
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
            {icon ? (
              React.cloneElement(icon, {
                marginRight: "8px",
              })
            ) : (
              <AddProjectIcon marginRight="8px" />
            )}

            {addLabel ?? "Añadir"}
          </Button>
        </>
      )}
    </Flex>
  )
}
