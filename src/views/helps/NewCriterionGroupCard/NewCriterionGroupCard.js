import React, { useEffect, useState } from "react"
import { Box, Flex, Text } from "@chakra-ui/layout"
import { OptionsIcon } from "../../../components/icons/OptionsIcon"
import { ICONS_PROPS_16 } from "../../../utils/constants/icons"
import { Button } from "@chakra-ui/button"
import { AddIcon } from "@chakra-ui/icons"
import { chakra } from "@chakra-ui/system"

export const NewCriterionGroupCard = ({ createCriterion, ...props }) => {
  const [value, setValue] = useState("")
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  console.log(value)

  const onEnter = () => {
    console.log("entra")
    createCriterion({ title: value })
  }

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        onEnter()
      }
    })
    return document.removeEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        onEnter()
      }
    })
  }, [value])

  return (
    <Flex
      direction="column"
      justify="space-between"
      p="16px"
      border="1px solid #c9c9c9"
      borderRadius="2px"
      w="266px"
      h="293px"
    >
      <Flex height="32px" justify="space-between">
        <Box maxWidth="80%" height="32px" cursor="pointer">
          <chakra.input
            mt="2px"
            color="blue.500"
            value={value}
            onChange={(e) => handleChange(e)}
            placeholder="Escríbe el título"
            outline="none"
            fontFamily="Noway-Medium"
            fontSize="17px"
            lineHeight="19px"
          />
        </Box>
        <OptionsIcon {...ICONS_PROPS_16} color="grey" />
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
