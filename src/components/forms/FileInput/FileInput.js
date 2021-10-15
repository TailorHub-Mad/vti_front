import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadFileIcon } from "../../icons/UploadFileIcon"

export const FileInput = ({
  disabled,
  maxFiles = 10,
  value,
  label,
  maxSize = 10000000,
  onChange,
  isDisabled = false,
  isUpdate,
  ...props
}) => {
  const [fileError, setFileError] = useState(null)

  const onDrop = async (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter(
      (item) =>
        (item.size / 1000000 <= maxSize && item.type === "text/csv") ||
        item.type === "application/pdf" ||
        item.type === "image/jpg" ||
        item.type === "image/png" ||
        item.type === "image/jpeg"
    )

    if (filteredFiles.length === 0) return setFileError("documentsError")
    if (acceptedFiles.length !== filteredFiles.length)
      return setFileError("someDocumentsError")

    setFileError(null)

    if (value?.length) {
      filteredFiles.length + value.length <= maxFiles &&
        onChange([...value, ...filteredFiles])
    } else {
      filteredFiles.length <= maxFiles && onChange(filteredFiles)
    }
  }

  const handleDelete = (position) => {
    const newFilteredFiles = [...value]
    newFilteredFiles.splice(position, 1)
    onChange(newFilteredFiles)
  }

  const formatFileName = (file) =>
    isUpdate ? file?.path || file.url.split("-")[1] : file.path

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Box {...props} pointerEvents={isDisabled ? "none" : "all"}>
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
          <UploadFileIcon color="grey" mb="3px" />
          <Text variant="d_s_medium" color="grey">
            {label || "Adjunte o arrastre un documento"}
          </Text>
        </Box>
      </Flex>

      {value ? (
        <Flex wrap="wrap" justifyContent="flex-start">
          {value.map((v, idx) => {
            return (
              <Flex
                key={`${v.size}-${idx}`}
                mr={idx < value.length ? "16px" : 0}
                mt="8px"
                justify="flex-start"
                alignItems="center"
              >
                <DeleteIcon
                  color="error"
                  mr="4px"
                  cursor="pointer"
                  onClick={() => handleDelete(idx)}
                />
                <Text mt="5px">{formatFileName(v)}</Text>
              </Flex>
            )
          })}
        </Flex>
      ) : null}

      {fileError ? (
        <Text mt="8px" color="error">
          Error en documentos
        </Text>
      ) : null}
    </Box>
  )
}
