import {
  ScaleFade,
  Modal,
  ModalOverlay,
  Box,
  Flex,
  Button,
  Radio,
  RadioGroup,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { CustomModalContent } from "../../overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../overlay/Modal/CustomModalHeader/CustomModalHeader"

export const GroupModal = ({ isOpen, onClose, onGroup, ...props }) => {
  const [activeItem, setActiveItem] = useState(null)
  const options = [
    {
      label: "Proyecto",
      value: "project",
    },
    {
      label: "Año",
      value: "year",
    },
    {
      label: "Sector",
      value: "sector",
    },
    {
      label: "Tag de apunte",
      value: "note_tag",
    },
  ]
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <CustomModalContent>
        <ScaleFade in={isOpen}>
          <Box
            width="460px"
            height="fit-content"
            position="absolute"
            top="50px"
            left={"calc(50vw - 230px)"}
            transition="left 0.18s ease-in-out"
            bgColor="white"
            zIndex="1400"
            padding="32px"
            {...props}
          >
            <CustomModalHeader title="Agrupar" onClose={onClose} pb="24px" />
            <RadioGroup onChange={setActiveItem} value={activeItem}>
              {options.map((option) => (
                <Flex
                  key={option.value}
                  bgColor="light_grey"
                  width="100%"
                  p="8px"
                  h="44px"
                  onClick={() => setActiveItem(option.value)}
                  cursor="pointer"
                  mb="8px"
                >
                  <Radio value={option.value}>{option.label}</Radio>
                </Flex>
              ))}
            </RadioGroup>
            <Button
              onClick={() => onGroup()}
              display="block"
              margin="0 auto"
              mt="32px"
            >
              Agrupar
            </Button>
          </Box>
        </ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
