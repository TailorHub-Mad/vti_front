import {
  ScaleFade,
  Modal,
  ModalOverlay,
  Box,
  Flex,
  Radio,
  RadioGroup,
  Button
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"

const options = [
  {
    label: "Apunte creado",
    value: "1"
  },
  {
    label: "Apunte respondido",
    value: "2"
  },
  {
    label: "Mensaje cerrado/formalizado",
    value: "3"
  },
  {
    label: "Mensajes modificados",
    value: "4"
  },
  {
    label: "Nuevo proyecto",
    value: "5"
  },
  {
    label: "Nuevo sistema de ensayo",
    value: "6"
  },
  {
    label: "Notificación administrador",
    value: "7"
  },
  {
    label: "Notificación mantenimiento",
    value: "8"
  },
  {
    label: "Nuevo tag de apunte",
    value: "9"
  },
  {
    label: "Nueva suscripción",
    value: "10"
  }
]

export const NotificationsFilterModal = ({
  isOpen,
  onClose,
  onFilter,
  ...props
}) => {
  const [activeItem, setActiveItem] = useState([])

  const handleOnClose = () => {
    setActiveItem(null)
    onClose()
  }

  useEffect(() => {
    if (isOpen) return
    setActiveItem(null)
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade in={isOpen}>
          <Box
            width="460px"
            height="fit-content"
            position="fixed"
            top="50px"
            left={"calc(50vw - 230px)"}
            transition="left 0.18s ease-in-out"
            bgColor="white"
            padding="32px"
            {...props}
          >
            <CustomModalHeader
              title="Filtrar tipo de notificación"
              onClose={onClose}
              pb="24px"
            />
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
              onClick={() => onFilter(activeItem)}
              display="block"
              margin="0 auto"
              mt="32px"
              isDisabled={!activeItem}
            >
              Filtrar
            </Button>
          </Box>
        </ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
