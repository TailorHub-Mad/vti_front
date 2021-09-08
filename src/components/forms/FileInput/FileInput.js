import { Box, Flex, Text } from "@chakra-ui/react"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadFileIcon } from "../../icons/UploadFileIcon"

export const FileInput = ({
  disabled,
  maxFiles = 10,
  value,
  label,
  maxSize = 10000000,
  onChange,
  ...props
}) => {
  const [fileError, setFileError] = useState(null)
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const filteredFiles = acceptedFiles.filter(
        (item) =>
          item.size / 1000000 <= maxSize &&
          (item.type === "application/pdf" ||
            item.type === "image/jpg" ||
            item.type === "image/png" ||
            item.type === "image/jpeg")
      )
      if (filteredFiles.length === 0) {
        setFileError("documentsError")
      } else if (acceptedFiles.length !== filteredFiles.length) {
        setFileError("someDocumentsError")
      } else {
        setFileError(null)
      }
      if (value?.length) {
        filteredFiles.length + value.length <= maxFiles &&
          onChange([...value, ...filteredFiles])
      } else {
        filteredFiles.length <= maxFiles && onChange(filteredFiles)
      }
    },
    [value]
  )
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Box {...props}>
      <Flex
        background="#EBEEF2"
        border="1px dashed #052E57"
        borderRadius="2px"
        align="center"
        justify="center"
        {...getRootProps()}
        disabled={disabled || value?.length >= maxFiles}
        w="100%"
        h="140px"
        cursor="copy"
      >
        <input {...getInputProps()} />
        <Box textAlign="center">
          <UploadFileIcon color="grey" mb="3px"/>
          <Text variant="d_s_medium" color="grey" >{label || "Adjunte o arrastre EXCEL"}</Text>
        </Box>
      </Flex>
      {fileError ? <Text color="error">Error en documentos</Text> : null}
    </Box>
  )
}
