import { ScaleFade, Modal, ModalOverlay, Box, Button } from "@chakra-ui/react"

import React, { useContext, useEffect, useState } from "react"
import { useSWRConfig } from "swr"
import { AuxFilter } from "../../../../components/filters/FilterModal/AuxFilter/AuxFilter"
import { CustomModalContent } from "../../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../../components/overlay/Modal/CustomModalHeader/CustomModalHeader"
import useProjectApi from "../../../../hooks/api/useProjectApi"
import { ToastContext } from "../../../../provider/ToastProvider"
import { SWR_CACHE_KEYS } from "../../../../utils/constants/swr"
import { NewProjectForm } from "../NewProjectForm/NewProjectForm"

export const NewProjectModal = ({ isOpen, onClose, projectToUpdate, ...props }) => {
  const { showToast } = useContext(ToastContext)
  const { createProject, updateProject } = useProjectApi()
  const { mutate, cache } = useSWRConfig()

  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [values, setValues] = useState({
    alias: "",
    client: "",
    sector: "",
    year: "",
    focusPoint: "",
    testSystems: "",
    tags: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isUpdate = Boolean(projectToUpdate)

  const handleChange = (val) => setValues(val)

  const checkInputsAreEmpty = () => {
    return Object.keys(values).some((key) => !values[key])
  }

  const handleOpenSecundaryContent = () => setShowSecondaryContent(true)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const updatedProjectsList = isUpdate
      ? await handleUpdateProject()
      : await handleCreateProject()

    updatedProjectsList
      ? await mutate(SWR_CACHE_KEYS.projects, updatedProjectsList, false)
      : await mutate(SWR_CACHE_KEYS.projects)

    showToast(
      isUpdate ? "Editado correctamente" : "¡Proyecto añadido satisfactoriamente!"
    )
    setIsSubmitting(false)
    onClose()
  }

  const handleCreateProject = async () => {
    const _values = {
      ...values,
      date: { year: values.year.toString(), month: "02", day: "25" },
    }

    delete _values.year
    delete _values.id
    delete _values.tags

    const response = await createProject(_values)

    // TODO -> manage errors
    if (response?.error) {
      console.log("ERROR")
      return
    }

    const { data: newProject } = response

    if (cache.has(SWR_CACHE_KEYS.projects)) {
      const cacheProjects = cache.get(SWR_CACHE_KEYS.projects)
      const updatedProjects = []
      updatedProjects.push({
        projects: [newProject, ...cacheProjects[0].projects],
      })
      return updatedProjects
    }
    return null
  }

  const handleUpdateProject = async () => {
    const { _id } = projectToUpdate

    const _values = {
      ...values,
      date: { year: values.year.toString(), month: "02", day: "25" },
    }
    delete _values.year
    delete _values.id
    delete _values.tags

    const response = await updateProject(_id, _values)

    // TODO -> manage errors
    if (response?.error) {
      console.log("ERROR")
      return
    }

    // TODO -> optimize cache request (update cache with updated project)
    return null
  }

  useEffect(() => {
    if (!projectToUpdate) return
    console.log("projectToUpdate", projectToUpdate)
    const _project = {
      alias: projectToUpdate?.alias,
      sector: projectToUpdate.sector[0]?.title,
      client: projectToUpdate?.clientAlias,
      focusPoint: projectToUpdate?.focusPoint.map((fp) => fp.alias)[0],
      testSystems: projectToUpdate?.testSystems.map((ts) => ts.alias),
      year: +projectToUpdate?.date?.year,
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
      <CustomModalContent>
        <ScaleFade in={showSecondaryContent || showSecondaryContent !== "project"}>
          <Box
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
              projectToUpdate={projectToUpdate}
              value={values}
              openAuxModal={handleOpenSecundaryContent}
              onChange={handleChange}
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
          </Box>
        </ScaleFade>
        {showSecondaryContent ? (
          <AuxFilter onClose={() => setShowSecondaryContent(false)} />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
