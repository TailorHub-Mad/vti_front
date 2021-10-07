import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { useRouter } from "next/router"
export const TagsFilterModal = ({ isOpen, onClose, onFilter, ...props }) => {
  const [showMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)
  const router = useRouter()
  const isProjectTag = router.query.type === "projects"
  const initialValues = isProjectTag
    ? {
        project_tags: [""]
      }
    : {
        note_tags: [""]
      }
  const [filterValues, setFilterValues] = useState(initialValues)
  const handleReset = () => {
    //TODO Los inputs no reflejan el reset
    setFilterValues(initialValues)
  }

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
            onReset={handleReset}
          />
        </ScaleFade>

        {!showSaveFilter && showSecondaryContent === "project_tags" ? (
          <AuxFilter onClose={() => setShowSecondaryContent(false)} />
        ) : null}
        {!showSaveFilter && showSecondaryContent === "note_tags" ? (
          <AuxFilter onClose={() => setShowSecondaryContent(false)} />
        ) : null}
      </CustomModalContent>
    </Modal>
  )
}
