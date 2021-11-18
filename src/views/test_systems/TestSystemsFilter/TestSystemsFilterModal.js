import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { SupportFilter } from "./SupportFilter/SupportFilter"
import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"
import { SaveFilterModal } from "../../../components/filters/SaveFilterModal"
import { COMPLEX_OBJECT, parseComplexQuery } from "../../../utils/functions/filter"

export const TestsSystemsFilterModal = ({ isOpen, onClose, onFilter, ...props }) => {
  const [showMainContent] = useState(true)
  const [showSecondaryContent, setShowSecondaryContent] = useState(false)
  const [showAuxContent, setShowAuxContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)
  const [tab, setTab] = useState(0)

  const initialValues = {
    client: [{ label: "", value: "" }],
    year: [{ label: "", value: "" }],
    vti_code: [{ label: "", value: "" }],
    sector: [{ label: "", value: "" }],
    project_tags: [{ label: "", value: "" }]
  }

  const [filterValues, setFilterValues] = useState(initialValues)
  const [filterComplexValues, setFilterComplexValues] = useState(null)
  const [filterMetadata, setfilterMetadata] = useState(null)
  const [isUpdateFilter, setIsUpdateFilter] = useState(false)
  const [changeValueFilter, setChangeValueFilter] = useState(false)

  const handleOnReset = () => {
    setFilterValues(initialValues)
    onFilter(null)
  }

  const handleOnFilter = () => {
    if (filterComplexValues) {
      const query = parseComplexQuery(
        filterComplexValues,
        COMPLEX_OBJECT.TEST_SYSTEMS
      )
      onFilter(query, "complex")
    } else {
      // setFilterValues(initialValues)
      onFilter(filterValues)
    }
  }

  const handleOnClose = () => {
    // setFilterValues(initialValues)
    onClose()
  }

  const handleEditFilter = (filter) => {
    setfilterMetadata(filter)
    setIsUpdateFilter(true)
    setShowSaveFilter(true)
  }

  useEffect(() => {
    setChangeValueFilter(true)
  }, [filterValues])

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
            setTab={setTab}
            onEdit={handleEditFilter}
            onFilterComplexChange={(val) => setFilterComplexValues(val)}
          />
        </ScaleFade>
        {showSaveFilter ? (
          <SaveFilterModal
            onClose={() => setShowSaveFilter(false)}
            filter={!changeValueFilter ? filterMetadata.query : filterValues}
            filterMetadata={filterMetadata}
            isUpdateFilter={isUpdateFilter}
            type={tab === 0 ? "simple" : "complex"}
            object="testSystems"
          />
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
