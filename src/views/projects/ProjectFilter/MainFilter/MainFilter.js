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
import React, { useEffect, useState } from "react"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import { AdvancedFilterIcon } from "../../../../components/icons/AdvancedFilterIcon"
import { SimpleFilterIcon } from "../../../../components/icons/SimpleFilterIcon"
import { AdvancedFilter } from "./AdvancedFilter/AdvancedFilter"
import { SimpleFilterForm } from "./SimpleFilterForm/SimpleFilterForm"
import useFilterApi from "../../../../hooks/api/useFilterApi"
import { EditIcon } from "@chakra-ui/icons"
import { variantGeneralTag } from "../../../../utils/constants/tabs"

export const MainFilter = ({
  onClose,
  onSecondaryOpen,
  onSimpleFilterChange,
  onFilter,
  simpleFilterValues,
  moveToLeft,
  openSaveModal,
  onReset,
  setTab,
  ...props
}) => {
  const [isReset, setIsReset] = useState(false)

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

  const handleEditFilter = () => {
    console.log("eedita")
  }

  const handleChargeFilter = (filter) => {
    const { query } = filter
    onSimpleFilterChange(JSON.parse(query))
  }

  useEffect(() => {
    const _getFilters = async () => {
      const simple = await getFilterSimple()
      const complex = await getFilterComplex()

      setFilterSimple(simple)
      setFilterComplex(complex)
    }
    _getFilters()
  }, [])

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
            <AdvancedFilter />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex justifyContent="space-between">
        <Button variant="secondary" onClick={openSaveModal}>
          Recordar
        </Button>
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
