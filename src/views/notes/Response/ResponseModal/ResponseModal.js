import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useNoteApi from "../../../../hooks/api/useNoteApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { ResponseForm } from "../ResponseForm/ResponseForm"

export const ResponseModal = ({
  isOpen,
  noteId,
  onClose,
  messageToUpdate,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { createMessage, updateMessage } = useNoteApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState({})
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
        ? value.forEach((v) => formData.set(key, v))
        : formData.set(key, value)
    })

    return formData
  }

  const formatUpdateMessage = (note) => {
    const formatData = {
      message: note.message
    }

    if (note?.link) formatData["link"] = note.link
    if (note?.documents) formatData["documents"] = [...note.documents]

    const formData = new FormData()

    Object.entries(formatData).forEach(([key, value]) => {
      Array.isArray(value)
        ? value.forEach((v) => formData.set(key, v))
        : formData.set(key, value)
    })

    console.log(formData)

    return formData
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateMessage() : await handleCreateMessage()
    await mutate(SWR_CACHE_KEYS.notes)
    showToast(isUpdate ? "Editado correctamente" : "¡Mensaje enviado!")
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
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar mensaje" : "Escribir respuesta"}
          onClose={onClose}
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
