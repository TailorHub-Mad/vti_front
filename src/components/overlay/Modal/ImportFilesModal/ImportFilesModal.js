import { Button, Modal, ModalOverlay, Text, ModalContent } from "@chakra-ui/react"
import React, { useState } from "react"
import { FileInput } from "../../../forms/FileInput/FileInput"
import { CustomModalHeader } from "../CustomModalHeader/CustomModalHeader"

export const ImportFilesModal = ({ title, isOpen, onClose, ...props }) => {
  const [files, setFiles] = useState(null)
  const handleSubmit = () => {}
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={title || "Importar archivos"}
          onClose={onClose}
          pb="24px"
        />
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
