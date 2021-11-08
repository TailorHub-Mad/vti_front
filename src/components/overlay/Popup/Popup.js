import {
  Button,
  Img,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text
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
  type = "girl",
  children,
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props} zIndex="9999">
      <ModalOverlay />
      <ModalContent
        minW={["100%", null, null, "502"]}
        width={["100%", null, null, "502"]}
        alignSelf="center"
        alignItems="center"
        borderRadius="2px"
        boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
        p="40px 83px"
        zIndex="9999"
      >
        <ModalBody>{children || message}</ModalBody>
        {variant === "info" && (
          <Img
            pos="absolute"
            right={["20px", null, null, "40px"]}
            top={["-70px", null, null, "-100px"]}
            src={
              type === "girl"
                ? "/images/illustrations/girl_sit.svg"
                : "/images/illustrations/boy_sit.svg"
            }
            w={["68px", null, null, "auto"]}
            h="auto"
            objectFit="contain"
          />
        )}
        {variant === "twoButtons" && (
          <ModalFooter
            display="grid"
            gridTemplateColumns={["1fr", null, null, "1fr 1fr"]}
            gridColumnGap="16px"
            gridRowGap="16px"
          >
            <Button
              minW="160px"
              height="56px"
              color={color}
              borderColor={color}
              variant="secondary"
              onClick={onConfirm}
            >
              <Text color="error" variant="d_m_medium">
                {confirmText}
              </Text>
            </Button>
            <Button
              minW="160px"
              height="56px"
              bgColor={color}
              borderColor={color}
              onClick={onClose}
            >
              <Text color="white" variant="d_m_medium">
                {cancelText}
              </Text>
            </Button>
          </ModalFooter>
        )}
        {variant === "hover" && (
          <ModalFooter>
            <Button
              minW="160px"
              height="56px"
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
