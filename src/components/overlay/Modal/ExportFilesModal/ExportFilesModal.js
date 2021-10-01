import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Progress
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { CustomModalHeader } from "../CustomModalHeader/CustomModalHeader"

export const ExportFilesModal = ({ title, isOpen, onClose, onExport, ...props }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let runProgress
    if (isOpen && progress <= 100) {
      runProgress = setInterval(() => {
        setProgress((prog) => prog + 2)
      }, 25)
    }
    return () => {
      clearInterval(runProgress)
    }
  }, [isOpen])

  useEffect(() => {
    if (progress >= 100) {
      onExport()
    }
  }, [progress])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={title || "Exportando"}
          onClose={onClose}
          pb="24px"
        />

        <Progress value={progress} />
        <Button
          w="194px"
          margin="0 auto"
          mt="64px"
          onClick={() => onClose()}
          variant="secondary"
        >
          Cancelar
        </Button>
      </ModalContent>
    </Modal>
  )
}
