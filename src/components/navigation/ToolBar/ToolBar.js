import { CloseIcon, SearchIcon } from "@chakra-ui/icons"
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  useMediaQuery,
  Box,
  useOutsideClick,
  Text
} from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { CloudButton } from "../../buttons/CloudButton/CloudButton"
import { FilterButton } from "../../filters/FilterButton"
import { Group } from "../../grouping/Group"
import { AddProjectIcon } from "../../icons/AddProjectIcon"
import { fetchType } from "../../../utils/constants/swr"
import { ActionMenuMobile } from "../../icons/ActionMenuMobile"
import { FilterIcon } from "../../icons/FilterIcon"
import { UploadCloudIcon } from "../../icons/UploadCloudIcon"
import { ExportIcon } from "../../icons/ExportIcon"

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
  const [menuMobile, setMenuMobile] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleOnGroup = (activeItem) => {
    setMenuMobile(false)
    onGroup(activeItem)
  }
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
        value={searchValue}
        type={searchDate ? "date" : undefined}
        variant="white"
        onChange={(e) => {
          onSearch(e.target.value)
          setSearchValue(e.target.value)
        }}
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

  const refMenu = useRef(null)
  // useOutsideClick({
  //   ref: refMenu,
  //   handler: () => setMenuMobile(false)
  // })

  return (
    <Flex>
      {isScreen ? null : menuMobile ? (
        <Box
          ref={refMenu}
          position="absolute"
          bottom="0"
          left="0"
          width="100%"
          minH="288px"
          bgColor="blue.500"
          boxShadow="0px -4px 8px rgba(5, 46, 87, 0.1)"
          borderRadius="8px 8px 0px 0px"
          zIndex="1000"
          p="21px"
        >
          <Flex justify="flex-end" mb="32px">
            <CloseIcon
              w="14px"
              h="14px"
              color="white"
              onClick={() => setMenuMobile(false)}
            />
          </Flex>
          <Flex flexDirection="column" gridGap="32px">
            <Flex
              align="center"
              color="white"
              gridGap="8px"
              onClick={handleOnFilter}
            >
              <FilterIcon />
              <Text color="white" mt="4px" variant="d_s_medium">
                Filtrar
              </Text>
            </Flex>

            <Group
              onGroup={handleOnGroup}
              options={groupOptions}
              active={fetchState === fetchType.GROUP || queryGroup}
              isMobile
            />

            <Flex align="center" color="white" gridGap="8px" onClick={onImport}>
              <UploadCloudIcon />
              <Text color="white" mt="4px" variant="d_s_medium">
                Importar
              </Text>
            </Flex>
            <Flex align="center" color="white" gridGap="8px">
              <ExportIcon />
              <Text color="white" mt="4px" variant="d_s_medium" onClick={onExport}>
                Exportar
              </Text>
            </Flex>
          </Flex>
        </Box>
      ) : null}

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
      ) : (
        <Button
          variant="icon_only_secondary_mobile"
          onClick={() => setMenuMobile(true)}
          mr="18px"
        >
          <ActionMenuMobile color="blue.500" />
        </Button>
      )}

      {noSearch || (
        <>
          {isScreen ? (
            searchBar
          ) : (
            <Box ref={ref}>
              {!showBar ? (
                <Button
                  variant="icon_only_secondary_mobile"
                  onClick={() => setShowBar(true)}
                  mr="18px"
                >
                  <SearchIcon color="blue.500" />
                </Button>
              ) : (
                searchBar
              )}
            </Box>
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
