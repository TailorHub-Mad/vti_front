import { Modal, ModalOverlay, Button, ModalContent } from "@chakra-ui/react"
import React, { useContext, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useProjectApi from "../../../../hooks/api/useProjectApi"

import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { destructuringDate } from "../../../../utils/functions/date"

import { FinishProjectForm } from "../FinishProjectForm/FinishProjectForm"

const initialValues = {
  date: undefined,
  focusPoint: undefined
}

export const FinishProjectModal = ({
  isOpen,
  onClose,
  project,
  isGrouped,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { mutate } = useSWRConfig()
  const { updateProject } = useProjectApi()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkInputsAreEmpty = () => !values.date || !values.focusPoint

  const handleSubmit = async () => {
    setIsSubmitting(true)

    await updateProject(project._id, {
      focusPoint: values.focusPoint.value,
      closed: destructuringDate(values.date)
    })

    setValues(initialValues)

    isGrouped
      ? await mutate(SWR_CACHE_KEYS.groupProjects)
      : await mutate(SWR_CACHE_KEYS.projects)

    showToast({ message: "Ha finalizado el proyecto" })
    setIsSubmitting(false)
    setValues(initialValues)
    onClose()
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
          title="Finalizar proyecto"
          onClose={handleOnClose}
          pb="24px"
        />
        <FinishProjectForm
          value={values}
          onChange={(val) => setValues(val)}
          project={project}
        />
        <Button
          w="194px"
          margin="0 auto"
          mt="24px"
          disabled={checkInputsAreEmpty()}
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
