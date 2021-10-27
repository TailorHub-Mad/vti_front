import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useNotificationApi from "../../../../hooks/api/useNotificationApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewNotificationForm } from "../NewNotificationForm/NewNotificationForm"

const initialValues = {
  description: undefined
}

export const NewNotificationModal = ({ isOpen, onClose, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createNotification } = useNotificationApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkInputsAreEmpty = () => {
    return !values.description
  }

  const submitIsDisabled = checkInputsAreEmpty()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      await createNotification(values)
      setValues(initialValues)
      await mutate(SWR_CACHE_KEYS.notifications)
      showToast({ message: "Notificación enviada" })
      setIsSubmitting(false)
      onClose()
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title="Crear notificación"
          onClose={handleOnClose}
          pb="24px"
        />
        <NewNotificationForm
          value={values}
          onChange={(val) => setValues(val)}
          submitIsDisabled={submitIsDisabled}
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
