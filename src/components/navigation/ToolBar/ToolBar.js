import { SearchIcon } from "@chakra-ui/icons"
import { Button, Input, InputGroup, InputLeftElement, Flex } from "@chakra-ui/react"
import React from "react"
import { CloudButton } from "../../buttons/CloudButton/CloudButton"
import { Filter } from "../../filters/Filter"
import { Group } from "../../grouping/Group"
import { AddProjectIcon } from "../../icons/AddProjectIcon"
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
  noImport,
  noSearch,
  noAdd,
  fetchState,
  icon
}) => {
  const handleOnGroup = (activeItem) => onGroup(activeItem)
  const handleOnFilter = (activeItem) => onFilter(activeItem)

  return (
    <Flex>
      {noFilter || <Filter onFilter={handleOnFilter} />}
      {noGroup || (
        <Group
          onGroup={handleOnGroup}
          options={groupOptions}
          active={fetchState === fetchType.GROUP}
        />
      )}
      {noSearch || (
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
      )}
      {noImport || <CloudButton onImport={onImport} onExport={onExport} />}
      {noAdd || (
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
      )}
    </Flex>
  )
}
