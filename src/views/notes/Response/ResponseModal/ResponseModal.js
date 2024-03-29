import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useNoteApi from "../../../../hooks/api/useNoteApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { ResponseForm } from "../ResponseForm/ResponseForm"
import { createFormData } from "../../../../utils/functions/formdata"

const initialValues = {}

export const ResponseModal = ({
  isOpen,
  noteId,
  onClose,
  messageToUpdate,
  fromProjectDetail,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { createMessage, updateMessage } = useNoteApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(messageToUpdate)

  const checkInputsAreEmpty = () => !values.message

  const submitIsDisabled = checkInputsAreEmpty()

  const formatCreateMessage = (note) => {
    const formatData = {
      message: note.message
    }

    if (note?.link) formatData["link"] = note.link
    if (note?.documents) formatData["file"] = note.documents

    const formData = new FormData()

    Object.entries(formatData).forEach(([key, value]) => {
      Array.isArray(value)
        ? value.forEach((v) => formData.append(key, v))
        : formData.append(key, value)
    })

    return formData
  }

  const formatUpdateMessage = (note) => {
    const _formatData = {}
    const formatData = {
      message: note.message
    }

    if (note?.link) formatData["link"] = note.link

    if (note?.documents) {
      const { files, documents } = note.documents.reduce(
        (acc, doc) => {
          if (doc.path) acc.files.push(doc)
          else acc.documents.push(doc)
          return acc
        },
        {
          files: [],
          documents: []
        }
      )

      _formatData["documents"] = documents
      _formatData["file"] = files
    }

    const formData = createFormData(_formatData)

    Object.entries(formatData).forEach(([key, value]) => {
      Array.isArray(value)
        ? value.forEach((v) => formData.append(key, v))
        : formData.append(key, value)
    })

    return formData
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateMessage() : await handleCreateMessage()
    setValues(initialValues)
    await mutate(SWR_CACHE_KEYS.notes)
    await mutate([
      SWR_CACHE_KEYS.filterNotes,
      `notes.projects._id=${fromProjectDetail}`
    ])
    showToast({ message: isUpdate ? "Editado correctamente" : "¡Mensaje enviado!" })
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateMessage = async () => {
    try {
      const message = formatCreateMessage(values)
      await createMessage(noteId, message)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateMessage = async () => {
    try {
      const message = formatUpdateMessage(values)
      await updateMessage(noteId, messageToUpdate._id, message)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!messageToUpdate) return

    const message = {
      message: messageToUpdate.message,
      link: messageToUpdate.link,
      documents: messageToUpdate.documents
    }

    setValues(message)
  }, [messageToUpdate])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} variant="response" {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar mensaje" : "Escribir respuesta"}
          onClose={handleOnClose}
          pb="24px"
        />

        <ResponseForm
          value={values}
          onChange={(val) => setValues(val)}
          submitIsDisabled={submitIsDisabled}
          isUpdate={Boolean(messageToUpdate)}
        />
        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={submitIsDisabled}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          pointerEvents={isSubmitting ? "none" : "all"}
        >
          Guardar
        </Button>
      </ModalContent>
    </Modal>
  )
}
