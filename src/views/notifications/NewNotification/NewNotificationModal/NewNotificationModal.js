import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useNotificationApi from "../../../../hooks/api/useNotificationApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { createFormData } from "../../../../utils/functions/formdata"
import { NewNotificationForm } from "../NewNotificationForm/NewNotificationForm"

const initialValues = {
  project: undefined,
  system: undefined,
  title: undefined,
  description: undefined,
  tags: undefined,
  link: undefined,
  documents: undefined
}

export const NewNotificationModal = ({
  isOpen,
  onClose,
  notificationToUpdate,
  notificationFromProject,
  ...props
}) => {
  const { showToast } = useContext(ToastContext)
  const { createNote, updateNote } = useNotificationApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(notificationToUpdate)

  const checkInputsAreEmpty = () => {
    return (
      !values.project ||
      !values.system ||
      !values.title ||
      !values.description ||
      !values.tags
    )
  }

  const submitIsDisabled = checkInputsAreEmpty()

  const formatCreateNote = (notification) => {
    const formatData = {
      project: notification.project.value,
      testSystems: notification.system.map((s) => s.value),
      title: notification.title,
      description: notification.description,
      tags: notification.tags.map((t) => t.value)
    }

    if (notification?.link) formatData["link"] = notification.link
    if (notification?.documents) formatData["file"] = notification.documents

    const formData = new FormData()

    Object.entries(formatData).forEach(([key, value]) => {
      Array.isArray(value)
        ? value.forEach((v) => formData.append(key, v))
        : formData.append(key, value)
    })

    return formData
  }

  const formatUpdateNote = (notification) => {
    const _formatData = {}
    const formatData = {
      title: notification.title,
      description: notification.description,
      tags: notification.tags.map((t) => t.value)
    }

    if (notification?.link) formatData["link"] = notification.link

    if (notification?.documents) {
      const { files, documents } = notification.documents.reduce(
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
    isUpdate ? await handleUpdateNote() : await handleCreateNote()
    setValues(initialValues)
    notificationFromProject
      ? await mutate([SWR_CACHE_KEYS.project, notificationFromProject.project.value])
      : await mutate(SWR_CACHE_KEYS.notifications)
    showToast(isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s apunte/s!")
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateNote = async () => {
    try {
      const notification = formatCreateNote(values)
      await createNote(notification)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateNote = async () => {
    try {
      const notification = formatUpdateNote(values)
      await updateNote(notificationToUpdate._id, notification)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    if (notificationFromProject)
      setValues({
        project: values.project
      })
    else setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!notificationToUpdate) return

    const _notification = {
      project: notificationToUpdate.projects[0].alias,
      system: notificationToUpdate.testSystems.map((ts) => ts.alias),
      title: notificationToUpdate.title,
      description: notificationToUpdate.description,
      link: notificationToUpdate.link,
      documents: notificationToUpdate.documents,
      tags: notificationToUpdate.tags.map((t) => t.name)
    }

    setValues(_notification)
  }, [notificationToUpdate])

  useEffect(() => {
    if (!notificationFromProject) return
    setValues(notificationFromProject)
  }, [notificationFromProject])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? "Editar apunte" : "Añadir nuevo apunte"}
          onClose={handleOnClose}
          pb="24px"
        />
        <NewNotificationForm
          value={values}
          onChange={(val) => setValues(val)}
          notificationToUpdate={notificationToUpdate}
          notificationFromProject={notificationFromProject}
          submitIsDisabled={submitIsDisabled}
          isUpdate={Boolean(notificationToUpdate)}
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
