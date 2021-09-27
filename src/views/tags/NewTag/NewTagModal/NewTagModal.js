import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useTagApi from "../../../../hooks/api/useTagApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewTagForm } from "../NewTagForm/NewTagForm"

export const NewTagModal = ({
  isOpen,
  onClose,
  tagToUpdate,
  isProjectTag,
  addTitle,
  addSuccessMsg,
  editTitle,
  editSuccessMsg
}) => {
  const { showToast } = useContext(ToastContext)
  const { createProjectTag, updateProjectTag, createNoteTag, updateNoteTag } =
    useTagApi()
  const { mutate } = useSWRConfig()

  const [values, setValues] = useState([{}])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(tagToUpdate)

  const handleChange = (val, idx) => {
    const _values = [...values]
    _values[idx] = val
    if (val.relatedTag) {
      _values[idx].relatedTag = val.relatedTag.value
    }

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
    isUpdate ? await handleUpdateTag() : await handleCreateTag()
    await mutate(SWR_CACHE_KEYS.projectTags)
    showToast(isUpdate ? editSuccessMsg : addSuccessMsg)
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateTag = async () => {
    try {
      const projectTagsToCreate = [...values].map((pTag) =>
        isProjectTag ? createProjectTag(pTag) : createNoteTag(pTag)
      )
      await Promise.all(projectTagsToCreate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateTag = async () => {
    try {
      const { _id } = tagToUpdate
      isProjectTag
        ? await updateProjectTag(_id, values[0])
        : await updateNoteTag(_id, values[0])
    } catch (error) {
      errorHandler(error)
    }
  }

  useEffect(() => {
    if (!tagToUpdate) return
    const { relatedTag, name } = tagToUpdate
    setValues([{ relatedTag, name }])
  }, [tagToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues([{}])
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? editTitle : addTitle}
          onClose={onClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          addTitle="Añadir nuevo tag"
        >
          <NewTagForm isProjectTag={isProjectTag} />
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
            {addTitle}
          </Button>
        ) : null}
      </ModalContent>
    </Modal>
  )
}
