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

const initialValues = {
  name: undefined,
  relatedTag: undefined
}

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

  const [values, setValues] = useState([initialValues])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(tagToUpdate)

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
    return values.some((value) => !value.name)
  }

  const formatTags = (tags) => {
    return tags.map((tag) => {
      const formatTag = {
        name: tag.name
      }
      if (tag?.relatedTag) formatTag["relatedTag"] = tag.relatedTag.value
      return formatTag
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateTag() : await handleCreateTag()
    await mutate(isProjectTag ? SWR_CACHE_KEYS.projectTags : SWR_CACHE_KEYS.noteTags)
    showToast(isUpdate ? editSuccessMsg : addSuccessMsg)
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateTag = async () => {
    try {
      const tagsToCreate = formatTags(values)
      const func = isProjectTag ? createProjectTag : createNoteTag
      const tagsQueue = tagsToCreate.map((tag) => func(tag))
      await Promise.all(tagsQueue)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateTag = async () => {
    try {
      const { _id } = tagToUpdate
      const [data] = formatTags(values)
      const func = isProjectTag ? updateProjectTag : updateNoteTag
      await func(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues([initialValues])
    onClose()
  }

  useEffect(() => {
    if (!tagToUpdate) return
    const { parent, name } = tagToUpdate
    setValues([{ relatedTag: parent.name, name }])
  }, [tagToUpdate])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="48px 32px" borderRadius="2px">
        <CustomModalHeader
          title={isUpdate ? editTitle : addTitle}
          onClose={handleOnClose}
          pb="24px"
        />
        <MultipleFormContent
          values={values}
          onChange={handleChange}
          onDelete={handleDelete}
          objectToUpdate={tagToUpdate}
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
