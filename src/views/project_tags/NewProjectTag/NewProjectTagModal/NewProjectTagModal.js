import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useTagApi from "../../../../hooks/api/useTagApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewProjectTagForm } from "../NewProjectTagForm/NewProjectTagForm"

export const NewProjectTagModal = ({ isOpen, onClose, projectTagToUpdate }) => {
  const { showToast } = useContext(ToastContext)
  const { createProjectTag, updateProjectTag } = useTagApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(projectTagToUpdate)

  const handleChange = (val, idx) => {
    const _values = [...values]
    _values[idx] = val
    setValues(_values)
  }

  const handleDelete = (index) => {
    const _values = [...values]
    _values.splice(index, 1)
    setValues(_values)
  }

  const checkInputsAreEmpty = () => {
    return values.some(
      (value) =>
        // TODO -> autogenerate ID
        // !value.id ||
        !value.name
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateProjectTag() : await handleCreateProjectTag()
    await mutate(SWR_CACHE_KEYS.projectTags)
    showToast(
      isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s tag de proyecto/s!"
    )
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateProjectTag = async () => {
    try {
      const projectTagsToCreate = [...values]
      await createProjectTag(projectTagsToCreate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateProjectTag = async () => {
    try {
      const { _id } = projectTagToUpdate
      const [data] = [...values]
      await updateProjectTag(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  useEffect(() => {
    if (!projectTagToUpdate) return
    const { parent, name } = projectTagToUpdate
    setValues([{ parent, name }])
  }, [projectTagToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={
            isUpdate ? "Editar tag de proyecto" : "Añadir nuevo tag de proyecto"
          }
          onClose={onClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo tag de proyecto"
        >
          <NewProjectTagForm />
        </MultipleFormContent>
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

        {!isUpdate ? (
          <Button
            variant="text_only"
            onClick={() => setValues([...values, {}])}
            disabled={checkInputsAreEmpty()}
          >
            Añadir nuevo Tag de proyecto
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
