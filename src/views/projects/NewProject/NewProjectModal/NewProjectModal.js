import { ScaleFade, Modal, ModalOverlay, Button, Box } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { CustomModalContent } from "../../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useHelpApi from "../../../../hooks/api/useHelpApi"
import useProjectApi from "../../../../hooks/api/useProjectApi"
import useTagApi from "../../../../hooks/api/useTagApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { errorHandler } from "../../../../utils/errors"
import {
  destructuringDate,
  formatDateToInput
} from "../../../../utils/functions/date"
import { SupportModal } from "../../../helps/NewCriterion/NewCriterionModal/SupportModal/SupportModal"
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
  const { getProjectHelps } = useHelpApi()
  const { getProjectTags } = useTagApi()

  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [usedProjectTags, setUsedProjectTags] = useState([])
  const [projectCriteria, setProjectCriteria] = useState([])

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

  //TODO Esta función se repite en todos los apoyos, se podría refactorizar para meterla en utils
  const handleTagSelect = (_tags) => {
    const refTags = values.tags
    const refUsed = usedProjectTags
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
    setValues({
      ...values,
      tags: nextTags
    })
  }

  useEffect(() => {
    const fetchCriteria = async () => {
      const _data = await getProjectHelps()
      setProjectCriteria(_data)
    }

    const fetchTags = async () => {
      const _tags = await getProjectTags()
      const _used = _tags.filter((tag) => !tag.isUsed)
      setUsedProjectTags(_used)
    }

    fetchCriteria()
    fetchTags()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade in={showSecondaryContent || !showSecondaryContent}>
          <Box
            width="460px"
            height="fit-content"
            position="absolute"
            top="50px"
            left={showSecondaryContent ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
            transition="left 0.18s ease-in-out"
            bgColor="white"
            borderRadius="2px"
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
          </Box>
        </ScaleFade>
        {showSecondaryContent ? (
          <SupportModal
            onClose={() => setShowSecondaryContent(false)}
            usedTags={usedProjectTags}
            criteria={projectCriteria}
            onTagsSelect={(tags) => handleTagSelect(tags, true)}
            selectedTags={values?.tags?.map((t) => t.label) || []}
          />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
