import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { SupportFilter } from "./SupportFilter/SupportFilter"
import { SaveFilterModal } from "./SaveFilterModal/SaveFilterModal"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"

export const ProjectsFilterModal = ({ isOpen, onClose, onFilter, ...props }) => {
  const [showMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showAuxContent, setShowAuxContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)
  const initialValues = {
    client: "",
    test_system: "",
    year: "",
    vti_code: [""],
    focus_point: [""],
    sector: "",
    tag_project: [""]
  }
  const [filterValues, setFilterValues] = useState(initialValues)

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <CustomModalContent>
        <ScaleFade
          in={
            !showSaveFilter &&
            showMainContent &&
            (!showSecondaryContent || showSecondaryContent !== "project")
          }
        >
          <MainFilter
            simpleFilterValues={filterValues}
            onClose={onClose}
            moveToLeft={["project_tags", "note_tags"].includes(showSecondaryContent)}
            onSecondaryOpen={(type) => setShowSecondaryContent(type)}
            onSimpleFilterChange={(val) => setFilterValues(val)}
            openSaveModal={() => setShowSaveFilter(true)}
            onFilter={() => onFilter(filterValues)}
          />
        </ScaleFade>
        {showSaveFilter ? (
          <SaveFilterModal onClose={() => setShowSaveFilter(false)} />
        ) : null}
        {!showSaveFilter && showSecondaryContent === "project" ? (
          <SupportFilter
            onClose={() => setShowSecondaryContent(false)}
            onSecondaryOpen={() => setShowAuxContent(true)}
            isAuxOpen={showAuxContent}
          />
        ) : null}
        {!showSaveFilter && showSecondaryContent === "project_tags" ? (
          <AuxFilter onClose={() => setShowSecondaryContent(false)} />
        ) : null}
        {!showSaveFilter && showSecondaryContent === "note_tags" ? (
          <AuxFilter onClose={() => setShowSecondaryContent(false)} />
        ) : null}

        {!showSaveFilter && showAuxContent && showSecondaryContent === "project" ? (
          <AuxFilter onClose={() => setShowAuxContent(false)} />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
