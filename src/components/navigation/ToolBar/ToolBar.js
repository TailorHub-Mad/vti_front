import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement, Flex } from "@chakra-ui/react"
import React, { useContext } from "react"
import { CloudButton } from "../../buttons/CloudButton/CloudButton"
import { FilterButton } from "../../filters/FilterButton"
import { Group } from "../../grouping/Group"
import { AddProjectIcon } from "../../icons/AddProjectIcon"
import { ApiAuthContext } from "../../../provider/ApiAuthProvider"
import { RoleType } from "../../../utils/constants/global"
import { fetchType } from "../../../utils/constants/swr"

export const ToolBar = ({
  onAdd,
  onSearch,
  onGroup,
  onFilter,
  onImport,
  onExport,
  addLabel,
  searchPlaceholder,
  groupOptions,
  noFilter,
  noGroup,
  fetchState,
  icon
}) => {
  const { role } = useContext(ApiAuthContext)

  const handleOnGroup = (activeItem) => onGroup(activeItem)
  const handleOnFilter = (activeItem) => onFilter(activeItem)

  return (
    <Flex>
      {noFilter || <FilterButton onFilter={handleOnFilter} />}
      {noGroup || (
        <Group
          onGroup={handleOnGroup}
          options={groupOptions}
          active={fetchState === fetchType.GROUP}
        />
      )}
      <InputGroup
        width="196px"
        marginRight="16px"
        cursor="not-allowed" /* provisional */
      >
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
                marginRight: "8px"
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
