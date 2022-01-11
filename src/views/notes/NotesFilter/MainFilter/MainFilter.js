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
import { variantGeneralTag } from "../../../../utils/constants/tabs"
import { EditIcon } from "@chakra-ui/icons"
import { RoleType } from "../../../../utils/constants/global"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { ChevronDownIcon } from "../../../../components/icons/ChevronDownIcon"
import { ChevronUpIcon } from "../../../../components/icons/ChevronUpIcon"

const criteria = [
  { label: "AliasCL", value: "AliasCL" },
  { label: "AliasProy", value: "AliasProy" },
  { label: "RefProy", value: "RefProy" },
  { label: "RefSis", value: "RefSis" },
  { label: "AliasSis", value: "AliasSis" },
  { label: "Cerrado", value: "Cerrado", isBoolean: true },
  { label: "Formalizado", value: "Formalizado", isBoolean: true },
  { label: "Respuestas", value: "Respuestas", isBoolean: true },
  { label: "TagAp", value: "TagAp" },
  { label: "TagProy", value: "TagProy" },
  { label: "RefAp", value: "RefAp" },
  { label: "TitleAp", value: "TitleAp" },
  { label: "Description", value: "Description" },
  { label: "Documents", value: "Documents", isBoolean: true },
  { label: "VtiCode", value: "VtiCode" }
]

export const MainFilter = ({
  onClose,
  onSecondaryOpen,
  onSimpleFilterChange,
  onFilter,
  simpleFilterValues,
  filterComplexValues,
  moveToLeft,
  openSaveModal,
  onReset,
  setTab,
  onEdit,
  onFilterComplexChange,
  errorComplexFilter,
  showSaveFilter,
  noteFromProject,
  ...props
}) => {
  const [isReset, setIsReset] = useState(false)

  const { role } = useContext(ApiAuthContext)

  const [showFilters, setShowFilters] = useState(true)
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

  const handleChargeFilter = (filter, isComplex) => {
    const { query } = filter
    if (isComplex) {
      onFilterComplexChange(query)
      return
    }
    onSimpleFilterChange(JSON.parse(query))
  }

  const _getFilters = async () => {
    const simple = await getFilterSimple("notes")
    const complex = await getFilterComplex("notes")

    setFilterSimple(simple)
    setFilterComplex(complex)
  }

  useEffect(() => {
    _getFilters()
  }, [])

  useEffect(() => {
    _getFilters()
  }, [showSaveFilter])

  const rowFilter = (filters, isComplex) => {
    return (
      <Box position="relative" w="100%">
        <Flex
          width="100%"
          justify="space-between"
          onClick={() => setShowFilters(!showFilters)}
          cursor="pointer"
        >
          <Text cursor="pointer" mt="3px">
            {`${showFilters ? "Ocultar" : "Mostrar"} filtros guardados`}
          </Text>
          {showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
        {showFilters ? (
          <Flex mt="12px" width="100%" wrap="wrap" height="fit-content" pb="8px">
            {filters.map((value, idx) => {
              return (
                <Tag
                  key={`${value._id}-${idx}`}
                  variant={
                    value.public
                      ? variantGeneralTag.PROJECT
                      : variantGeneralTag.SYSTEM
                  }
                  mb="8px"
                  mr="8px"
                  height="32px"
                  width="auto"
                  cursor="pointer"
                >
                  <Flex align="center">
                    <Text onClick={() => handleChargeFilter(value, isComplex)}>
                      {value.name}
                    </Text>
                    {RoleType.ADMIN === role ? (
                      <EditIcon
                        width="16px"
                        cursor="pointer"
                        mb="3px"
                        ml="8px"
                        onClick={() => handleEditFilter(value)}
                      />
                    ) : null}
                  </Flex>
                </Tag>
              )
            })}
          </Flex>
        ) : null}
      </Box>
    )
  }

  return (
    <Box
      width={["100%", null, null, "460px"]}
      height={["100vh", null, null, "fit-content"]}
      position="absolute"
      top={["0", null, null, "50px"]}
      left={[
        "0",
        null,
        null,
        moveToLeft ? "calc(50vw - 500px)" : "calc(50vw - 230px)"
      ]}
      transition={["none", null, null, "left 0.18s ease-in-out"]}
      zIndex="1400"
      {...props}
    >
      <Box
        bgColor="white"
        padding={["16px", null, null, "32px"]}
        pb={["96px", null, null, "32px"]}
      >
        <CustomModalHeader title="Filtrar" onClose={onClose} pb="24px" />
        <Tabs mb="24px" onChange={(index) => setTab(index)}>
          <TabList>
            <Tab _focus={{ outline: "none" }} pl={0} alignItems={"center"}>
              <SimpleFilterIcon mr="4px" />
              <Text mt="3px" variant={"d_s_medium"}>
                Filtrado sencillo
              </Text>
            </Tab>
            <Tab _focus={{ outline: "none" }} pl={0} ml="24px" alignItems={"center"}>
              <AdvancedFilterIcon mr="2px" />
              <Text mt="3px" variant="d_s_medium">
                Filtrado complejo
              </Text>
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
                noteFromProject={noteFromProject}
              />
            </TabPanel>
            <TabPanel p={0} minH={["100vh", "100vh", "fit-content", "fit-content"]}>
              <Box m="16px 0">
                {filterComplex.length === 0 ? (
                  <Text color="grey">No hay filtros guardados para recordar</Text>
                ) : (
                  rowFilter(filterComplex, true)
                )}
              </Box>
              <AdvancedFilter
                criteria={criteria}
                filterComplexValues={filterComplexValues}
                onChange={(v)=>{
                  console.log("ONCHANGE", v)
                  onFilterComplexChange(v)}}
                errorComplexFilter={errorComplexFilter}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Flex
          justifyContent={role === RoleType.USER ? "center" : "space-between"}
          position={["fixed", null, null, "relative"]}
          bottom={["0", null, null, null]}
          left={["0", null, null, null]}
          width="100%"
          pb={["8px", null, null, null]}
          pt={["8px", null, null, null]}
          boxShadow={["0px -4px 8px rgba(5, 46, 87, 0.1)", null, null, "none"]}
          bgColor={["white", null, null, null]}
        >
          {role === RoleType.ADMIN ? (
            <Button variant="secondary" onClick={openSaveModal}>
              Recordar
            </Button>
          ) : null}
          <Button onClick={onFilter} ml="8px">
            Filtrar
          </Button>
        </Flex>

        <Flex justify="center">
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
      <Box h="200px" display={["none", null, null, "block"]} />
    </Box>
  )
}
