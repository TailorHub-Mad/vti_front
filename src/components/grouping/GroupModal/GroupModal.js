import {
  ScaleFade,
  Modal,
  ModalOverlay,
  Box,
  Flex,
  Button,
  Radio,
  RadioGroup
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { CustomModalContent } from "../../overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../overlay/Modal/CustomModalHeader/CustomModalHeader"

export const GroupModal = ({ isOpen, onClose, onGroup, options = [], ...props }) => {
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    if (isOpen) return
    setActiveItem(null)
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade in={isOpen}>
          <Box
            width={["100%", null, null, "460px"]}
            height="fit-content"
            position="fixed"
            top={["50vw", null, null, "50px"]}
            left={["0", null, null, "calc(50vw - 230px)"]}
            transition="left 0.18s ease-in-out"
            bgColor="white"
            zIndex="10001"
            padding={["16px", null, null, "32px"]}
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
              onClick={() => onGroup(activeItem)}
              display="block"
              margin="0 auto"
              mt="32px"
              isDisabled={!activeItem}
            >
              Agrupar
            </Button>
          </Box>
        </ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
