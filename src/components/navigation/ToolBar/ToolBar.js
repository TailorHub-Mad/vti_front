import { SearchIcon } from "@chakra-ui/icons"
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  useMediaQuery,
  useOutsideClick
} from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { CloudButton } from "../../buttons/CloudButton/CloudButton"
import { FilterButton } from "../../filters/FilterButton"
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
  searchDate,
  icon,
  selectedRows,
  queryGroup,
  queryFilter
}) => {
  const [isScreen] = useMediaQuery("(min-width: 475px)")
  const [showBar, setShowBar] = useState(false)

  const handleOnGroup = (activeItem) => onGroup(activeItem)
  const handleOnFilter = (activeItem) => onFilter(activeItem)

  const searchBar = (
    <InputGroup width="196px" marginRight="16px">
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon color="grey" />}
      />
      <Input
        placeholder={searchPlaceholder ?? "Busqueda por ID"}
        paddingLeft="40px"
        type={searchDate ? "date" : undefined}
        variant="white"
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          _placeholder: {
            color: "grey"
          }
        }}
      />
    </InputGroup>
  )

  const ref = useRef(null)
  useOutsideClick({
    ref: ref,
    handler: () => setShowBar(false)
  })

  return (
    <Flex>
      {isScreen ? (
        <>
          {noFilter || (
            <FilterButton
              onFilter={handleOnFilter}
              active={fetchState === fetchType.FILTER || queryFilter}
            />
          )}
          {noGroup || (
            <Group
              onGroup={handleOnGroup}
              options={groupOptions}
              active={fetchState === fetchType.GROUP || queryGroup}
            />
          )}
        </>
      ) : null}

      {noSearch || (
        <>
          {isScreen ? (
            searchBar
          ) : !showBar ? (
            <Button
              ref={ref}
              variant="icon_only_secondary_mobile"
              onClick={() => setShowBar(true)}
              mr="18px"
            >
              <SearchIcon color="blue.500" />
            </Button>
          ) : (
            searchBar
          )}
        </>
      )}

      {isScreen ? (
        <>
          {noImport || (
            <CloudButton
              onImport={onImport}
              onExport={onExport}
              isDisabled={
                fetchState === fetchType.FILTER ||
                fetchState === fetchType.GROUP ||
                (selectedRows && Object.keys(selectedRows)?.length > 0)
              }
            />
          )}
          {noAdd || (
            <Button onClick={onAdd} justifyContent="center" alignItems="center">
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
        </>
      ) : null}
    </Flex>
  )
}
