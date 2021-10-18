import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React from "react"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"

export const NotificationsFilterModal = ({ isOpen, onClose, ...props }) => {
  const handleOnClose = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade in={true}></ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
