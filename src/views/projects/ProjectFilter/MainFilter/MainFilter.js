import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tag
} from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import { AdvancedFilterIcon } from "../../../../components/icons/AdvancedFilterIcon"
import { SimpleFilterIcon } from "../../../../components/icons/SimpleFilterIcon"
import { AdvancedFilter } from "./AdvancedFilter/AdvancedFilter"
import { SimpleFilterForm } from "./SimpleFilterForm/SimpleFilterForm"
import useFilterApi from "../../../../hooks/api/useFilterApi"
import { EditIcon } from "@chakra-ui/icons"
import { variantGeneralTag } from "../../../../utils/constants/tabs"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { RoleType } from "../../../../utils/constants/global"

const criteria = [
  { label: "TagAp", value: "TagAp" },
  { label: "TagProy", value: "TagProy" },
  { label: "AliasProy", value: "AliasProy" },
  { label: "AliasSis", value: "AliasSis" },
  { label: "AliasFocusPoint", value: "AliasFocusPoint" },
  { label: "RefProy", value: "RefProy" },
  { label: "RefSis", value: "RefSis" },
  { label: "VtiCode", value: "VtiCode" },
  { label: "RefAp", value: "RefAp" },
  { label: "TitleAp", value: "TitleAp" },
  { label: "Sector", value: "Sector" },
  { label: "Year", value: "Year" },
  { label: "Closed", value: "Closed" },
  { label: "AliasCl", value: "AliasCl" }
]

export const MainFilter = ({
  onClose,
  onSecondaryOpen,
  onSimpleFilterChange,
  onFilterComplexChange,
  onFilter,
  simpleFilterValues,
  moveToLeft,
  openSaveModal,
  onReset,
  setTab,
  onEdit,
  ...props
}) => {
  const [isReset, setIsReset] = useState(false)
  const { role } = useContext(ApiAuthContext)

  const [filterSimple, setFilterSimple] = useState([])
  const [filterComplex, setFilterComplex] = useState([])
  const { getFilterSimple, getFilterComplex } = useFilterApi()

  const handleOnReset = () => {
    setIsReset(true)
    onReset()

    setTimeout(() => {
      setIsReset(false)
    }, 1000)
  }

  const handleEditFilter = (filter) => {
    onEdit(filter)
  }

  const handleChargeFilter = (filter) => {
    const { query } = filter
    onSimpleFilterChange(JSON.parse(query))
  }

  useEffect(() => {
    const _getFilters = async () => {
      const simple = await getFilterSimple("projects")
      const complex = await getFilterComplex("projects")

      setFilterSimple(simple)
      setFilterComplex(complex)
    }
    _getFilters()
  }, [onClose])

  const rowFilter = (filters) => {
    return (
      <Flex mt="12px" width="100%" wrap="wrap" height="fit-content">
        {filters.map((value, idx) => {
          return (
            <Tag
              key={`${value._id}-${idx}`}
              variant={variantGeneralTag.SYSTEM}
              mb="8px"
              mr="8px"
              height="32px"
              width="auto"
              cursor="pointer"
            >
              <Flex align="center">
                <Text onClick={() => handleChargeFilter(value)}>{value.name}</Text>
                <EditIcon
                  width="16px"
                  cursor="pointer"
                  mb="3px"
                  ml="8px"
                  onClick={() => handleEditFilter(value)}
                />
              </Flex>
            </Tag>
          )
        })}
      </Flex>
    )
  }

  return (
    <Box
      width="460px"
      height="fit-content"
      position="absolute"
      top="50px"
      left={moveToLeft ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
      transition="left 0.18s ease-in-out"
      bgColor="white"
      zIndex="1400"
      padding="32px"
      {...props}
    >
      <CustomModalHeader title="Filtrar" onClose={onClose} pb="24px" />
      <Tabs mb="24px" onChange={(index) => setTab(index)}>
        <TabList>
          <Tab _focus={{ outline: "none" }} pl={0} alignItems="center">
            <SimpleFilterIcon mr="2px" />
            <Text variant="d_s_medium">Filtrado sencillo</Text>
          </Tab>
          <Tab _focus={{ outline: "none" }} pl={0} ml="24px" alignItems="center">
            <AdvancedFilterIcon mr="2px" />
            <Text variant="d_s_medium">Filtrado complejo</Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <Box m="16px 0">
              {filterSimple.length === 0 ? (
                <Text color="grey">No hay filtros guardados para recordar</Text>
              ) : (
                rowFilter(filterSimple)
              )}
            </Box>
            <SimpleFilterForm
              value={simpleFilterValues}
              onChange={onSimpleFilterChange}
              openAuxModal={onSecondaryOpen}
              isReset={isReset}
            />
          </TabPanel>

          <TabPanel p={0}>
            <Box m="16px 0">
              {filterComplex.length === 0 ? (
                <Text color="grey">No hay filtros guardados para recordar</Text>
              ) : (
                rowFilter(filterComplex)
              )}
            </Box>
            <AdvancedFilter
              criteria={criteria}
              value={simpleFilterValues}
              onChange={onFilterComplexChange}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex justifyContent={role === RoleType.USER ? "center" : "space-between"}>
        {role === RoleType.ADMIN ? (
          <Button variant="secondary" onClick={openSaveModal}>
            Recordar
          </Button>
        ) : null}

        <Button onClick={onFilter}>Filtrar</Button>
      </Flex>

      <Flex justifyContent="center">
        <Text
          onClick={handleOnReset}
          variant="d_xs_regular"
          mt="32px"
          cursor="pointer"
        >
          Resetear filtros
        </Text>
      </Flex>
    </Box>
  )
}
