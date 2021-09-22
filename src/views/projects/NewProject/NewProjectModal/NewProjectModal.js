import {
  ScaleFade,
  Modal,
  ModalOverlay,
  Button,
  ModalContent
} from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { AuxFilter } from "../../../../components/filters/FilterModal/AuxFilter/AuxFilter"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useProjectApi from "../../../../hooks/api/useProjectApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import { NewProjectForm } from "../NewProjectForm/NewProjectForm"

const initialValues = {
  alias: null,
  client: null,
  sector: null,
  year: null,
  focusPoint: null,
  testSystems: null
  // tags: [""], // provisioanl
}

export const NewProjectModal = ({ isOpen, onClose, projectToUpdate, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createProject, updateProject } = useProjectApi()
  const { mutate } = useSWRConfig()

  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(projectToUpdate)

  const checkInputsAreEmpty = () => {
    return (
      !values.alias ||
      !values.client ||
      !values.sector ||
      !values.year ||
      !values.focusPoint ||
      !values.testSystems
    )
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateProject() : await handleCreateProject()
    await mutate(SWR_CACHE_KEYS.projects)
    showToast(
      isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s proyecto/s!"
    )
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateProject = async () => {
    try {
      // TODO -> provisional
      const projectToCreate = {
        ...values,
        date: { year: values.year.toString(), month: "02", day: "25" },
        testSystems: [values.testSystems]
      }
      delete projectToCreate.year
      delete projectToCreate.id
      delete projectToCreate.tags

      await createProject(projectToCreate)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateProject = async () => {
    try {
      const { _id } = projectToUpdate

      // TODO -> provisional
      const data = {
        ...values,
        date: { year: values.year.toString(), month: "02", day: "25" }
      }
      delete data.year
      delete data.id
      delete data.tags

      await updateProject(_id, data)
    } catch (error) {
      errorHandler(error)
    }
  }

  useEffect(() => {
    if (!projectToUpdate) return
    const _project = {
      alias: projectToUpdate?.alias,
      sector: projectToUpdate.sector[0]?.title,
      client: projectToUpdate?.clientAlias,
      focusPoint: projectToUpdate?.focusPoint.map((fp) => fp.alias)[0],
      testSystems: projectToUpdate?.testSystems.map((ts) => ts.alias),
      year: +projectToUpdate?.date?.year
    }
    setValues(_project)
  }, [projectToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues({})
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <ScaleFade in={showSecondaryContent || !showSecondaryContent}>
        <ModalContent
          width="460px"
          height="fit-content"
          position="absolute"
          top="50px"
          left={showSecondaryContent ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
          transition="left 0.18s ease-in-out"
          bgColor="white"
          zIndex="1400"
          padding="32px"
          {...props}
        >
          <CustomModalHeader
            title={isUpdate ? "Editar proyecto" : "Añadir nuevo proyecto"}
            onClose={onClose}
            pb="24px"
          />
          <NewProjectForm
            value={values}
            openAuxModal={() => setShowSecondaryContent(true)}
            onChange={(val) => setValues(val)}
            projectToUpdate={projectToUpdate}
          />
          <Button
            margin="0 auto"
            mt="32px"
            display="block"
            disabled={checkInputsAreEmpty()}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            pointerEvents={isSubmitting ? "none" : "all"}
          >
            Guardar proyecto
          </Button>
        </ModalContent>
      </ScaleFade>
      {showSecondaryContent ? (
        <AuxFilter onClose={() => setShowSecondaryContent(false)} />
      ) : null}
    </Modal>
  )
}
