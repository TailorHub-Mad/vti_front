import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from "@chakra-ui/react"
import React, { useState } from "react"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import { AdvancedFilterIcon } from "../../../../components/icons/AdvancedFilterIcon"
import { SimpleFilterIcon } from "../../../../components/icons/SimpleFilterIcon"
import { AdvancedFilter } from "./AdvancedFilter/AdvancedFilter"
import { SimpleFilterForm } from "./SimpleFilterForm/SimpleFilterForm"

export const MainFilter = ({
  onClose,
  onSecondaryOpen,
  onSimpleFilterChange,
  onFilter,
  simpleFilterValues,
  moveToLeft,
  openSaveModal,
  onReset,
  ...props
}) => {
  const [isReset, setIsReset] = useState(false)

  const handleOnReset = () => {
    setIsReset(true)
    onReset()
  }

  return (
    <Box
      width="460px"
      maxHeight="calc(100vh - 120px)"
      overflowY="scroll"
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
      <Tabs mb="24px">
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
              <Text color="grey">No hay filtros guardados para recordar</Text>
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
              <Text color="grey">No hay filtros guardados para recordar</Text>
            </Box>
            <AdvancedFilter />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex justifyContent="space-between">
        <Button variant="secondary" onClick={openSaveModal}>
          Recordar
        </Button>
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
  )
}
