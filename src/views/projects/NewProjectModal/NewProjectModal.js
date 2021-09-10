import { ScaleFade, Modal, ModalOverlay, Box, Button } from "@chakra-ui/react"
import React, { useState } from "react"
import { AuxFilter } from "../../../components/filters/Filter/FilterModal/AuxFilter/AuxFilter"
import { CustomModalContent } from "../../../components/overlay/modal/CustomModalContent/CustomModalContent"
import { CustomModalHeader } from "../../../components/overlay/modal/CustomModalHeader/CustomModalHeader"
import { NewProjectForm } from "./NewProjectForm/NewProjectForm"

export const NewProjectModal = ({
  isOpen,
  onClose,
  textBody,
  color,
  title,
  childen,
  ...props
}) => {
  const [showMainContent, setShowMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const initialValues = {
    id: "",
    alias: "",
    client: "",
    sector: "",
    year: "",
    start_focal_point: "",
    test_systems: [""],
    project_tags: [""],
  }
  const [formValues, setFormValues] = useState(initialValues)
  const moveToLeft = showSecondaryContent
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <CustomModalContent>
        <ScaleFade
          in={
            showMainContent &&
            (!showSecondaryContent || showSecondaryContent !== "project")
          }
        >
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
              title="Añadir nuevo proyecto"
              onClose={onClose}
              pb="24px"
            />
            <NewProjectForm
              value={formValues}
              openAuxModal={() => setShowSecondaryContent(true)}
              onChange={(val) => setFormValues(val)}
            />
          </Box>
        </ScaleFade>
        {showSecondaryContent ? (
          <AuxFilter onClose={() => setShowSecondaryContent(false)} />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
