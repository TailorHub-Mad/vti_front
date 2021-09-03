import {
  Button,
  Image,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import React from "react"

export const Popup = ({
  isOpen,
  onClose,
  textBody,
  color,
  textButtonPrimary,
  textButtonSecondary,
  variant = "twoButtons",
  children,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent
        w={["343px", null, null, "502px"]}
        alignSelf="center"
        alignItems="center"
        borderRadius="2px"
        boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        padding="40px 0"
      >
        {/* <ModalHeader>Modal Title</ModalHeader> */}
        {/* <ModalCloseButton /> */}
        <ModalBody padding="0 24px">
          <Text textAlign="center" color={color}>
            {children}
          </Text>
        </ModalBody>
        {variant === "info" && (
          <Img
            pos="absolute"
            right={["20px", null, null, "40px"]}
            top={["-70px", null, null, "-100px"]}
            src="/images/illustrations/girl_sit.svg"
            w={["68px", null, null, "auto"]}
            h="auto"
            objectFit="contain"
          />
        )}
        {variant === "twoButtons" && (
          <ModalFooter
            padding="16px 24px 0 24px"
            display="grid"
            gridTemplateColumns={["1fr", null, null, "1fr 1fr"]}
            gridColumnGap="16px"
          >
            <Button color={color} borderColor={color} variant="secondary">
              Cerrar sesión
            </Button>
            <Button
              marginTop={["16px", null, null, "0"]}
              bgColor={color}
              borderColor={color}
              onClick={onClose}
            >
              Cancelar
            </Button>
          </ModalFooter>
        )}
        {variant === "hover" && (
          <ModalFooter padding="16px 24px 0 24px">
            <Button color={color} borderColor={color} variant="secondary">
              Cancelar
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}
