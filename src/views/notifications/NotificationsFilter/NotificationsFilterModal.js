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
    value: "Mensaje modificado"
  },
  {
    label: "Nuevo proyecto",
    value: "Nuevo Proyecto"
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
    value: "Nueva subscripción"
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
            width={["100%", null, null, "460px"]}
            height={["auto", null, null, "fit-content"]}
            position={["fixed", null, null, "absolute"]}
            top={["0", null, null, "50px"]}
            left={["0", null, null, "calc(50vw - 230px)"]}
            overflowY={["auto", null, null, null]}
            bottom={["0", null, null, null]}
            transition={["none", null, null, "left 0.18s ease-in-out"]}
            zIndex="1400"
            padding={["16px", null, null, "32px"]}
            pb={["96px", null, null, "32px"]}
            bgColor="white"
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
            <Flex
              justifyContent={"center"}
              position={["fixed", null, null, "relative"]}
              bottom={["0", null, null, null]}
              left={["0", null, null, null]}
              width="100%"
              pb={["8px", null, null, null]}
              pt={["8px", null, null, null]}
              boxShadow={["0px -4px 8px rgba(5, 46, 87, 0.1)", null, null, "none"]}
              bgColor={["white", null, null, null]}
            >
              <Button
                onClick={() => onFilter(values)}
                display="block"
                margin="0 auto"
                mt={["0", null, null, "32px"]}
                isDisabled={values.length === 0}
              >
                Filtrar
              </Button>
            </Flex>
          </Box>
        </ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
