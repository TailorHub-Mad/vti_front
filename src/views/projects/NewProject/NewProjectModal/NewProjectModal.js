import { ScaleFade, Modal, ModalOverlay, Button, Box, Flex } from "@chakra-ui/react"
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
    if (project.focusPoint) formatData["focusPoint"] = project.focusPoint.value
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
    showToast({
      message: isUpdate
        ? "Editado correctamente"
        : "¡Has añadido nuevo/s proyecto/s!"
    })
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
    if (!projectDetail) setValues(initialValues)
    onClose()
  }

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
      <CustomModalContent zIndex="10001" position="fixed">
        <ScaleFade
          padding="100px"
          in={showSecondaryContent || !showSecondaryContent}
        >
          <Box
            width={["100%", null, null, "460px"]}
            position="relative"
            top={["0", null, null, "50px"]}
            marginBottom={["0", null, null, "50px"]}
            left={[
              "0",
              null,
              null,
              showSecondaryContent ? "calc(50vw - 500px)" : "calc(50vw - 230px)"
            ]}
            transition={["none", null, null, "left 0.18s ease-in-out"]}
            bgColor="white"
            borderRadius="2px"
            padding={["16px", null, null, "32px"]}
            pb={["96px", null, null, null]}
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
            <Flex
              justifyContent={"center"}
              position={["fixed", null, null, "relative"]}
              bottom={["0", null, null, null]}
              left={["0", null, null, null]}
              width="100%"
              pb={["8px", null, null, null]}
              pt={["8px", null, null, null]}
              boxShadow={["0px -4px 8px rgba(5, 46, 87, 0.1)", null, null, "none"]}
              bgColor={["white", null, null, null]}
            >
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
            </Flex>
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
