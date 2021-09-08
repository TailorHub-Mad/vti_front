import {
  Button,
  Img,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import React from "react"

export const Popup = ({
  isOpen,
  onClose,
  message,
  color,
  confirmText,
  cancelText,
  onConfirm,
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
        <ModalBody padding="0 24px">
          <Text textAlign="center" color={color}>
            {children || message}
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
            <Button
              color={color}
              borderColor={color}
              variant="secondary"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
            <Button
              marginTop={["16px", null, null, "0"]}
              bgColor={color}
              borderColor={color}
              onClick={onClose}
            >
              {cancelText}
            </Button>
          </ModalFooter>
        )}
        {variant === "hover" && (
          <ModalFooter padding="16px 24px 0 24px">
            <Button
              color={color}
              borderColor={color}
              variant="secondary"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}
