import { Modal, ModalOverlay, Button, Box, SlideFade } from "@chakra-ui/react"
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
  editOnlyTags,
  isProjectView
}) => {
  const { showToast } = useContext(ToastContext)
  const [isProject, setIsProject] = useState(isProjectView)
  const [showSupportModal, setShowSupportModal] = useState(false)

  const {
    createProjectCriterion,
    updateProjectCriterion,
    createNoteCriterion,
    updateNoteCriterion
  } = useHelpApi()

  const [values, setValues] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleOnClose = () => {
    setValues({})
    onClose()
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
              setIsProject={setIsProject}
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
        <SlideFade in={showSupportModal} x="30px">
          <SupportModal onClose={() => setShowSupportModal(false)} />
        </SlideFade>
      </CustomModalContent>
    </Modal>
  )
}
