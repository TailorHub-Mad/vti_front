import {
  Box,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react"
import React, { useContext, useState } from "react"

import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { RoleType } from "../../../../utils/constants/global"

import { SimpleFilterForm } from "./SimpleFilterForm/SimpleFilterForm"



export const MainFilter = ({
  onClose,
  onSecondaryOpen,
  onSimpleFilterChange,
  onFilter,
  simpleFilterValues,
  moveToLeft,
  onReset,
  ...props
}) => {
  const [isReset, setIsReset] = useState(false)
  const { role } = useContext(ApiAuthContext)

  const handleOnReset = () => {
    setIsReset(true)
    onReset()

    setTimeout(() => {
      setIsReset(false)
    }, 1000)
  }


  return (
    <Box
      width={["100%", null, null, "460px"]}
      height={["auto", null, null, "fit-content"]}
      position={["fixed", null, null, "absolute"]}
      top={["0", null, null, "50px"]}
      left={[
        "0",
        null,
        null,
        moveToLeft ? "calc(50vw - 500px)" : "calc(50vw - 230px)"
      ]}
      overflowY={["auto", null, null, null]}
      bottom={["0", null, null, null]}
      transition={["none", null, null, "left 0.18s ease-in-out"]}
      zIndex="1400"
      padding={["16px", null, null, "32px"]}
      pb={["96px", null, null, "32px"]}
      bgColor="white"
      {...props}
    >
      <CustomModalHeader title="Filtrar" onClose={onClose} pb="24px" />
      <Box mt="24px">
        <SimpleFilterForm
          value={simpleFilterValues}
          onChange={onSimpleFilterChange}
          openAuxModal={onSecondaryOpen}
          isReset={isReset}
          mb="50px"
        />
      </Box>

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
        <Flex justifyContent="center" w="100%">
          <Button onClick={onFilter}>Filtrar</Button>
        </Flex>
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
