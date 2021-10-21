import {
  ScaleFade,
  Modal,
  ModalOverlay,
  Box,
  Flex,
  HStack,
  Checkbox,
  CheckboxGroup,
  Button
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"

const options = [
  {
    label: "Apunte creado",
    value: "Apunte creado"
  },
  {
    label: "Apunte respondido",
    value: "Apunte respondido"
  },
  {
    label: "Mensaje cerrado/formalizado",
    value: "Mensaje cerrado/formalizado"
  },
  {
    label: "Mensajes modificados",
    value: "Mensajes modificados"
  },
  {
    label: "Nuevo proyecto",
    value: "Nuevo proyecto"
  },
  {
    label: "Nuevo sistema de ensayo",
    value: "Nuevo sistema de ensayo"
  },
  {
    label: "Notificación administrador",
    value: "Notificación administrador"
  },
  {
    label: "Notificación mantenimiento",
    value: "Notificación mantenimiento"
  },
  {
    label: "Nuevo tag de apunte",
    value: "Nuevo tag de apunte"
  },
  {
    label: "Nuevo tag de proyecto",
    value: "Nuevo tag de proyecto"
  },
  {
    label: "Nueva suscripción",
    value: "Nueva suscripción"
  }
]

export const NotificationsFilterModal = ({
  isOpen,
  onClose,
  onFilter,
  ...props
}) => {
  const [values, setVaues] = useState([])

  const handleOnClose = () => {
    setVaues([])
    onClose()
  }

  const handleOnChange = (value) => {
    setVaues(value)
  }

  useEffect(() => {
    if (isOpen) return
    setVaues([])
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
            <CheckboxGroup onChange={handleOnChange}>
              <HStack>
                <Flex flexDirection="column" flex="1">
                  {options.map((option) => (
                    <Flex
                      key={option.value}
                      bgColor="light_grey"
                      width="100%"
                      p="8px"
                      h="44px"
                      cursor="pointer"
                      mb="8px"
                    >
                      <Checkbox
                        variant="multi"
                        value={option.value}
                        color="blue.500"
                      >
                        {option.label}
                      </Checkbox>
                    </Flex>
                  ))}
                </Flex>
              </HStack>
            </CheckboxGroup>
            <Button
              onClick={() => onFilter(values)}
              display="block"
              margin="0 auto"
              mt="32px"
              isDisabled={values.length === 0}
            >
              Filtrar
            </Button>
          </Box>
        </ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
