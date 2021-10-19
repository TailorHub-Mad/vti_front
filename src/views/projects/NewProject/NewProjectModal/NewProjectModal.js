import {
  ScaleFade,
  Modal,
  ModalOverlay,
  Button,
  ModalContent
} from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useProjectApi from "../../../../hooks/api/useProjectApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import {
  destructuringDate,
  formatDateToInput
} from "../../../../utils/functions/date"
import { NewProjectForm } from "../NewProjectForm/NewProjectForm"

const initialValues = {
  alias: undefined,
  client: undefined,
  sector: undefined,
  date: undefined,
  focusPoint: undefined,
  testSystems: undefined,
  tags: undefined
}

export const NewProjectModal = ({
  isOpen,
  onClose,
  projectToUpdate,
  projectDetail = false,
  ...props
}) => {
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
      !values.date ||
      !values.focusPoint
    )
  }

  const formatCreateProject = (project) => {
    const formatData = {
      alias: project.alias,
      client: project.client.value,
      sector: project.sector.value,
      focusPoint: project.focusPoint.value,
      date: destructuringDate(project.date)
    }

    if (project.testSystems)
      formatData["testSystems"] = project.testSystems?.map((system) => system.value)

    if (project.tags) formatData["tags"] = project.tags?.map((tag) => tag.value)

    return formatData
  }

  const formatUpdateProject = (project) => {
    const formatData = {
      alias: project.alias,
      sector: project.sector.value
    }

    if (project.testSystems)
      formatData["testSystems"] = project.testSystems?.map((system) => system.value)

    if (project.tags) formatData["tags"] = project.tags?.map((tag) => tag.value)

    return formatData
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    isUpdate ? await handleUpdateProject() : await handleCreateProject()
    setValues(initialValues)
    projectDetail
      ? await mutate([SWR_CACHE_KEYS.project, projectToUpdate._id])
      : await mutate(SWR_CACHE_KEYS.projects)
    showToast(
      isUpdate ? "Editado correctamente" : "¡Has añadido nuevo/s proyecto/s!"
    )
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateProject = async () => {
    try {
      const project = formatCreateProject(values)
      await createProject(project)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdateProject = async () => {
    try {
      const { _id } = projectToUpdate
      const project = formatUpdateProject(values)
      await updateProject(_id, project)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleOnClose = () => {
    setValues(initialValues)
    onClose()
  }

  useEffect(() => {
    if (!projectToUpdate) return

    const _project = {
      alias: projectToUpdate?.alias,
      sector: projectToUpdate.sector[0]?.title,
      client: projectToUpdate?.clientAlias,
      focusPoint: projectToUpdate?.focusPoint.map((fp) => fp.alias)[0],
      testSystems: projectToUpdate?.testSystems.map((ts) => ({
        label: ts.alias,
        value: ts._id
      })),
      tags: projectToUpdate?.tags.map((tg) => ({
        label: tg.name,
        value: tg._id
      })),
      date: formatDateToInput(projectToUpdate?.date)
    }

    setValues(_project)
  }, [projectToUpdate])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <ScaleFade in={showSecondaryContent || !showSecondaryContent}>
        <ModalContent
          width="460px"
          height="fit-content"
          position="static"
          left={showSecondaryContent ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
          transition="left 0.18s ease-in-out"
          bgColor="white"
          zIndex="1400"
          padding="32px"
          {...props}
        >
          <CustomModalHeader
            title={isUpdate ? "Editar proyecto" : "Añadir nuevo proyecto"}
            onClose={handleOnClose}
            pb="24px"
          />
          <NewProjectForm
            value={values}
            openAuxModal={() => setShowSecondaryContent(true)}
            onChange={(val) => {
              setValues(val)
            }}
            projectToUpdate={projectToUpdate}
          />
          <Button
            margin="0 auto"
            mt="32px"
            disabled={checkInputsAreEmpty()}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            display="flex"
            justifyContent="center"
            pointerEvents={isSubmitting ? "none" : "all"}
          >
            Guardar proyecto
          </Button>
        </ModalContent>
      </ScaleFade>
      {/* {showSecondaryContent ? (
        <AuxFilter onClose={() => setShowSecondaryContent(false)} />
      ) : null} */}
    </Modal>
  )
}
