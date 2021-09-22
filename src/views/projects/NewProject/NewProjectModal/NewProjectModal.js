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
import { destructuringDate } from "../../../../utils/functions/date"
import { NewProjectForm } from "../NewProjectForm/NewProjectForm"

const initialValues = {
  alias: undefined,
  client: undefined,
  sector: undefined,
  date: undefined,
  focusPoint: undefined,
  testSystems: undefined
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
      !values.date ||
      !values.focusPoint ||
      !values.testSystems
      // || !value.tags // TODO -> provisional
    )
  }

  const formatCreateProject = (project) => {
    return {
      alias: project.alias,
      client: project.client.value,
      sector: project.sector.value,
      focusPoint: project.focusPoint.value,
      testSystems: project.testSystems.map((system) => system.value),
      date: destructuringDate(project.date)
    }
  }

  // const formatUpdateProject = (project) => {
  //   return project.map((value) => {
  //     const { year, alias } = value
  //     return {
  //       alias,
  //       date: {
  //         year
  //       }
  //     }
  //   })
  // }

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
      const projectToCreate = formatCreateProject(values)

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
      date: projectToUpdate?.date?.date
    }
    setValues(_project)
  }, [projectToUpdate])

  useEffect(() => {
    if (isOpen) return
    setValues(initialValues)
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
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
