import { Modal, ModalOverlay, Button, Box } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { CustomModalContent } from "../../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useHelpApi from "../../../../hooks/api/useHelpApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { NewCriterionForm } from "../NewCriterionForm/NewCriterionForm"
import { CriterionTypeSelector } from "./CriterionTypeSelector/CriterionTypeSelector"
import { SupportModal } from "./SupportModal/SupportModal"

export const NewCriterionModal = ({
  isOpen,
  onClose,
  groupToEdit,
  addTitle,
  addSuccessMsg,
  criterionToEdit,
  editTitle,
  editOnlyTags,
  isProjectCriteria,
  fetchData,
  isCreation
}) => {
  const { showToast } = useContext(ToastContext)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const {
    getNoteHelps,
    getProjectHelps,
    createProjectCriterion,
    updateProjectCriterion,
    createNoteCriterion,
    updateNoteCriterion,
    getProjectTags,
    getNoteTags
  } = useHelpApi()

  const [values, setValues] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [criteria, setCriteria] = useState([])
  const [usedTags, setUsedTags] = useState([])
  const [unusedTags, setUnusedTags] = useState([])
  const [isProject, setIsProject] = useState(isProjectCriteria)

  const _isProject = isCreation ? isProject : isProjectCriteria
  const isUpdate = Boolean(groupToEdit)
  const handleChange = (val) => {
    setValues(val)
  }

  const checkInputsAreEmpty = () => {
    return Object.entries(values).some(([, value]) => !value)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateCriterion() : await handleCreateCriterion()
    setValues({})
    showToast(isUpdate ? "Criterio editado correctamente" : addSuccessMsg)
    fetchData()
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateCriterion = async () => {
    const _criterion = {
      title: values.title,
      group: [
        {
          name: values.group_title,
          relatedTags: values.relatedTags.map((rt) => rt.value)
        }
      ]
    }
    isProject
      ? await createProjectCriterion(_criterion)
      : await createNoteCriterion(_criterion)
  }

  const handleUpdateCriterion = async () => {
    const _groups = criterionToEdit.group
      .filter((gr) => gr._id !== groupToEdit._id)
      .map((cr) => ({ ...cr, relatedTags: cr.relatedTags.map((rt) => rt._id) }))
    const _criterion = {
      title: values.title,
      group: [
        ..._groups,
        {
          name: values.group_title,
          relatedTags: values.relatedTags.map((rt) => rt.value)
        }
      ]
    }
    isProjectCriteria
      ? await updateProjectCriterion(criterionToEdit._id, _criterion)
      : await updateNoteCriterion(criterionToEdit._id, _criterion)
  }

  const handleSelectType = (type) => {
    setIsProject(type)
    setValues({})
  }
  const handleOnClose = () => {
    setValues({})
    onClose()
  }

  const handleTagSelect = (_tags) => {
    let nextRelatedTags = values?.relatedTags ? [...values.relatedTags] : []

    _tags.forEach((_tag) => {
      if (nextRelatedTags.map((t) => t.label).includes(_tag)) {
        nextRelatedTags = nextRelatedTags.filter((rt) => rt.label !== _tag)
        return
      }
      const allTags = [...usedTags, ...unusedTags]
      const [tagInfo] = allTags.filter((t) => _tag === t.name)
      const selectedTag = { label: tagInfo.name, value: tagInfo._id }
      nextRelatedTags.push(selectedTag)
    })
    setValues({
      ...values,
      relatedTags: nextRelatedTags
    })
  }

  useEffect(() => {
    groupToEdit &&
      setValues({
        title: criterionToEdit?.title,
        group_title: groupToEdit?.name,
        relatedTags: groupToEdit?.relatedTags.map((rt) => ({
          label: rt.name,
          value: rt._id
        }))
      })
  }, [groupToEdit])

  const fetchCriteria = async () => {
    const _data = _isProject ? await getProjectHelps() : await getNoteHelps()
    setCriteria(_data)
  }

  const fetchTags = async () => {
    const _tags = _isProject ? await getProjectTags() : await getNoteTags()
    setUnusedTags(_tags.filter((tag) => !tag.isUsed))
    setUsedTags(_tags.filter((tag) => tag.isUsed))
  }
  useEffect(() => {
    fetchTags()
    fetchCriteria()
  }, [_isProject])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <CustomModalContent
        zIndex="10001"
        p="48px 32px"
        borderRadius="2px"
        overflowY="scroll"
        padding-bottom="120px"
      >
        {/* <ScaleFade in={showSupportModal}> */}

        <Box
          width="460px"
          height="fit-content"
          position="sticky"
          top="2px"
          left={showSupportModal ? "calc(50vw - 550px)" : "calc(50vw - 230px)"}
          transition="left 0.18s ease-in-out"
          bgColor="white"
          zIndex="1400"
          padding="32px"
        >
          <CustomModalHeader
            title={isUpdate ? editTitle : addTitle}
            onClose={handleOnClose}
            pb="24px"
          />
          {groupToEdit ? null : (
            <CriterionTypeSelector
              setIsProject={handleSelectType}
              isProject={_isProject}
            />
          )}
          <NewCriterionForm
            isProject={_isProject}
            value={values}
            onChange={handleChange}
            editOnlyTags={editOnlyTags}
            openSupportModal={() => setShowSupportModal(true)}
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
        </Box>
        {/* </ScaleFade> */}
        {showSupportModal ? (
          <SupportModal
            mb="120px"
            unusedTags={unusedTags}
            usedTags={usedTags}
            criteria={criteria}
            onClose={() => setShowSupportModal(false)}
            onTagsSelect={(tags) => handleTagSelect(tags)}
            selectedTags={values?.relatedTags?.map((rt) => rt.label)}
          />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
