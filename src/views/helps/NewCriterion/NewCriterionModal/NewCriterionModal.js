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
  editSuccessMsg,
  editOnlyTags
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
  const [isProject, setIsProject] = useState(true)
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
    showToast(isUpdate ? editSuccessMsg : addSuccessMsg)
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

    showToast("Grupo creado correctamente")
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
    isProject
      ? await updateProjectCriterion(criterionToEdit._id, _criterion)
      : await updateNoteCriterion(criterionToEdit._id, _criterion)

    showToast("Criterio editado correctamente")
  }

  const handleSelectType = (type) => {
    console.log("TYPE", type)
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
    const _data = isProject ? await getProjectHelps() : await getNoteHelps()
    setCriteria(_data)
  }

  const fetchTags = async () => {
    const _tags = isProject ? await getProjectTags() : await getNoteTags()
    setUnusedTags(_tags.filter((tag) => !tag.isUsed))
    setUsedTags(_tags.filter((tag) => tag.isUsed))
  }
  useEffect(() => {
    fetchTags()
    fetchCriteria()
  }, [isProject])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001" p="48px 32px" borderRadius="2px">
        {/* <ScaleFade in={showSupportModal}> */}

        <Box
          width="460px"
          height="fit-content"
          position="absolute"
          top="50px"
          left={showSupportModal ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
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
              isProject={isProject}
            />
          )}
          <NewCriterionForm
            isProject={isProject}
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
