import React, { useState } from "react"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { OptionsIcon } from "../../../components/icons/OptionsIcon"
import { ICONS_PROPS_16 } from "../../../utils/constants/icons"
import { Button } from "@chakra-ui/button"
import { AddIcon } from "@chakra-ui/icons"
import { chakra } from "@chakra-ui/system"

export const NewCriterionGroupCard = ({ createCriterionGroup, ...props }) => {
  const [value, _setValue] = useState("")
  const _valueRef = React.useRef(value)

  const setValue = (data) => {
    _valueRef.current = data
    _setValue(data)
  }

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const onEnter = () => {
    createCriterionGroup(_valueRef.current)
    setValue("")
  }

  const handleEnter = (e) => {
    if (e.code === "Enter") {
      onEnter()
    }
  }

  return (
    <Flex
      direction="column"
      justify="space-between"
      p="16px"
      border="1px solid #c9c9c9"
      borderRadius="2px"
      w="266px"
      h="293px"
      {...props}
    >
      <Flex height="32px" justify="space-between">
        <Box maxWidth="80%" height="32px" cursor="pointer">
          <chakra.input
            mt="2px"
            color="blue.500"
            value={value || ""}
            onChange={(e) => handleChange(e)}
            placeholder="Escríbe el título"
            outline="none"
            fontFamily="Noway-Medium"
            fontSize="17px"
            lineHeight="19px"
            onKeyDown={handleEnter}
          />
        </Box>
        <OptionsIcon {...ICONS_PROPS_16} color="grey" cursor="default" />
      </Flex>
      <Button
        mt="18px"
        height="24px"
        borderRadius="24px"
        width="100%"
        variant="secondary"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        isDisabled
      >
        <AddIcon w="12px" h="12px" mr="4px" />{" "}
        <Text variant="d_s_regular">Añadir tag</Text>
      </Button>
    </Flex>
  )
}
