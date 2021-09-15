import { ScaleFade, Modal, ModalOverlay, Box, Button } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { AuxFilter } from "../../../components/filters/FilterModal/AuxFilter/AuxFilter"
import { CustomModalContent } from "../../../components/overlay/modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../components/overlay/modal/CustomModalHeader/CustomModalHeader"
import { NewProjectForm } from "./NewProjectForm/NewProjectForm"

export const NewProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  projectToUpdate,
  ...props
}) => {
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const initialValues = {
    // id: "",
    alias: "",
    client: "",
    sector: "",
    year: "",
    focusPoint: "",
    testSystems: [""],
    // tags: [""],
  }
  const [formValues, setFormValues] = useState(initialValues)
  const moveToLeft = showSecondaryContent

  useEffect(() => {
    if (projectToUpdate) {
      const _project = {
        alias: projectToUpdate?.alias,
        client: "",
        sector: projectToUpdate?.sector[0]?._id,
        focusPoint: projectToUpdate?.focusPoint.map((fp) => fp._id)[0],
        testSystems: projectToUpdate?.testSystems.map((ts) => ts._id),
        year: +projectToUpdate?.date?.year,
      }
      //Falta id en el alias del cliente
      setFormValues(_project)
    }
  }, [projectToUpdate])

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
            left={moveToLeft ? "calc(50vw - 500px)" : "calc(50vw - 230px)"}
            transition="left 0.18s ease-in-out"
            bgColor="white"
            zIndex="1400"
            padding="32px"
            {...props}
          >
            <CustomModalHeader
              title={projectToUpdate ? "Editar proyecto" : "Añadir nuevo proyecto"}
              onClose={onClose}
              pb="24px"
            />
            <NewProjectForm
              projectToUpdate={projectToUpdate}
              value={formValues}
              openAuxModal={() => setShowSecondaryContent(true)}
              onChange={(val) => setFormValues(val)}
            />
            <Button
              margin="0 auto"
              mt="32px"
              display="block"
              onClick={() => onSubmit(formValues)}
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
