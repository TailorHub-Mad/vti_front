import { Modal, ModalOverlay, Button, Box } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { MultipleFormContent } from "../../../../components/forms/MultipleFormContent/MultipleFormContent"
import { CustomModalContent } from "../../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useHelpApi from "../../../../hooks/api/useHelpApi"
import useTagApi from "../../../../hooks/api/useTagApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { SupportModal } from "../../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
import { NewTagForm } from "../NewTagForm/NewTagForm"

const initialValues = [{}]

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
  const {
    createProjectTag,
    updateProjectTag,
    createNoteTag,
    updateNoteTag,
    getProjectTags,
    getNoteTags
  } = useTagApi()

  const { getProjectHelps, getNoteHelps } = useHelpApi()

  const { mutate } = useSWRConfig()

  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const [usedTags, setUsedTags] = useState([])
  const [criteria, setCriteria] = useState([])

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
    return values?.some((value) => !value.name)
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
    setValues(initialValues)
    await mutate(isProjectTag ? SWR_CACHE_KEYS.projectTags : SWR_CACHE_KEYS.noteTags)
    showToast({ message: isUpdate ? editSuccessMsg : addSuccessMsg })
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
    setValues([{ relatedTag: parent?.name, name }])
  }, [tagToUpdate])

  const handleTagSelect = (_tags) => {
    const refTags = values
    const refUsed = usedTags
    let nextTags = refTags ? [...refTags] : []

    _tags.forEach((_tag) => {
      if (nextTags.map((t) => t.label).includes(_tag)) {
        nextTags = nextTags.filter((rt) => rt.label !== _tag)
        return
      }
      const [tagInfo] = refUsed.filter((t) => _tag === t.name)
      const selectedTag = { label: tagInfo.name, value: tagInfo._id }
      nextTags.push(selectedTag)
    })
    const nextValues = values.map((v, idx) => {
      if (idx === activeIndex) {
        return { ...values[activeIndex], relatedTag: nextTags }
      }
      return v
    })
    setValues(nextValues)
  }

  useEffect(() => {
    const fetchCriteria = async (isProject) => {
      const _data = isProject ? await getProjectHelps() : await getNoteHelps()
      setCriteria(_data)
    }

    const fetchTags = async (isProject) => {
      const _tags = isProject ? await getProjectTags() : await getNoteTags()
      const _used = _tags.filter((tag) => !tag.isUsed)
      setUsedTags(_used)
    }

    fetchCriteria(isProjectTag)
    fetchTags(isProjectTag)
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <CustomModalContent p="48px 32px" borderRadius="2px" zIndex="10001">
        <Box
          width="460px"
          position="relative"
          top="50px"
          marginBottom="50px"
          left={showSecondaryContent ? "calc(50vw - 540px)" : "calc(50vw - 230px)"}
          transition="left 0.18s ease-in-out"
          bgColor="white"
          borderRadius="2px"
          padding="32px"
        >
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
            onHelperClick={(idx) => setActiveIndex(idx)}
          >
            <NewTagForm
              isProjectTag={isProjectTag}
              openAuxModal={() => setShowSecondaryContent(true)}
            />
          </MultipleFormContent>
          <Button
            w="194px"
            margin="0 auto"
            display="block"
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
        </Box>
        {showSecondaryContent ? (
          <SupportModal
            onClose={() => setShowSecondaryContent(false)}
            usedTags={usedTags}
            criteria={criteria}
            onTagsSelect={(tags) => handleTagSelect(tags, isProjectTag)}
            selectedTags={values[activeIndex]?.relatedTag?.map((t) => t.label)}
          />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
