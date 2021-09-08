import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { FileInput } from "../../../components/forms/FileInput/FileInput"
import { CloseIcon } from "../../../components/icons/CloseIcon"

export const ImportFilesModal = ({ title, isOpen, onClose, ...props }) => {
  const [files, setFiles] = useState(null)
  const handleSubmit = () => {
    console.log("Files", files)
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="32px" borderRadius="2px">
        <ModalHeader
          mb="32px"
          display="flex"
          p="0"
          justifyContent="space-between"
          w="100%"
        >
          <Text variant="d_l_medium">{title || "Importar archivos"}</Text>
          <CloseIcon width="24px" height="24px" cursor="pointer" onClick={onClose} />
        </ModalHeader>
        <Text variant="d_s_medium" mb="8px">
          {"Adjunte sus documentos"}
        </Text>
        <FileInput value={files} onChange={(_files) => setFiles(_files)} />
        <Button w="194px" margin="0 auto" mt="64px" onClick={handleSubmit}>
          Guardar
        </Button>
      </ModalContent>
    </Modal>
  )
}
