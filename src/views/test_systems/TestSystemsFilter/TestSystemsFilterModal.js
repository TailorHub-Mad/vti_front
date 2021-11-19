import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"

export const TestsSystemsFilterModal = ({ isOpen, onClose, onFilter, ...props }) => {
  const [showMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)

  const initialValues = {
    client: [{ label: "", value: "" }],
    year: [{ label: "", value: "" }],
    vti_code: [{ label: "", value: "" }],
    sector: [{ label: "", value: "" }],
    project_tags: [{ label: "", value: "" }]
  }

  const [filterValues, setFilterValues] = useState(initialValues)


  const handleOnReset = () => {
    setFilterValues(initialValues)
    onFilter(null)
  }

  const handleOnFilter = () => {
  
      onFilter(filterValues)
    
  }

  const handleOnClose = () => {
    onClose()
  }

  const handleEditFilter = () => {
    setShowSaveFilter(true)
  }



  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} {...props}>
      <ModalOverlay />
      <CustomModalContent zIndex="10001">
        <ScaleFade
          in={
            !showSaveFilter &&
            showMainContent &&
            (!showSecondaryContent || showSecondaryContent !== "project")
          }
        >
          <MainFilter
            simpleFilterValues={filterValues}
            onClose={handleOnClose}
            moveToLeft={["project_tags", "note_tags"].includes(showSecondaryContent)}
            onSecondaryOpen={(type) => setShowSecondaryContent(type)}
            onSimpleFilterChange={(val) => setFilterValues(val)}
            openSaveModal={() => setShowSaveFilter(true)}
            onFilter={handleOnFilter}
            onReset={handleOnReset}
            onEdit={handleEditFilter}
          />
        </ScaleFade>

        {!showSaveFilter && showSecondaryContent === "project_tags" ? (
          <AuxFilter onClose={() => setShowSecondaryContent(false)} />
        ) : null}


      </CustomModalContent>
    </Modal>
  )
}
