import {
  Button,
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  Box,
  Flex
} from "@chakra-ui/react"
import React, { useState } from "react"
import { CustomModalHeader } from "../CustomModalHeader/CustomModalHeader"
import { CSVReader } from "react-papaparse"
import { UploadFileIcon } from "../../../icons/UploadFileIcon"

export const ImportFilesModal = ({
  title,
  isOpen,
  label,
  onClose,
  onUpload,
  onDropDataTransform,
  ...props
}) => {
  const [data, setData] = useState(null)

  const handleSubmit = () => {
    onUpload(data)
  }

  const handleOnDrop = (jsonInfo) => {
    //TODO Gestión de errores al transformar la data
    setData(onDropDataTransform(jsonInfo))
  }

  const handleOnError = (e) => {
    console.log("Error", e)
  }

  const handleOnRemoveFile = () => {
    setData(null)
  }

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
        <Box
          sx={{
            ">div": {
              width: "100%",
              height: "100%",
              border: "none !important",
              padding: "0 !important"
            }
          }}
        >
          <CSVReader
            onDrop={handleOnDrop}
            onError={handleOnError}
            addRemoveButton
            onRemoveFile={handleOnRemoveFile}
            style={{
              dropFile: {
                marginTop: "16px",
                width: 200,
                height: 120,
                background: "#EBEEF2",
                borderRadius: "2px",
                border: "1px solid grey"
              },
              fileSizeInfo: {
                color: "#052E57",
                backgroundColor: "transparent",
                borderRadius: 2,
                lineHeight: 1,
                marginBottom: "0.5em",
                padding: "0 0.4em"
              },
              fileNameInfo: {
                color: "#052E57",
                backgroundColor: "transparent",
                borderRadius: 2,
                fontSize: 14,
                lineHeight: 1,
                padding: "0 16px"
              },
              removeButton: {
                color: "#F95C5C"
              },
              progressBar: {
                backgroundColor: "#052E57"
              }
            }}
          >
            <Flex
              textAlign="center"
              width="100%"
              height="180px"
              borderRadius="2px"
              border="1px dashed grey"
              justify="center"
              align="center"
              direction="column"
            >
              <UploadFileIcon color="grey" mb="3px" />
              <Text variant="d_s_medium" color="grey">
                {label || "Adjunte o arrastre un documento"}
              </Text>
            </Flex>
          </CSVReader>
        </Box>
        <Button
          w="194px"
          margin="0 auto"
          mt="64px"
          disabled={!data}
          onClick={handleSubmit}
        >
          Guardar
        </Button>
      </ModalContent>
    </Modal>
  )
}
