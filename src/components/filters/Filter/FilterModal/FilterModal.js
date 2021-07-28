import {
  ScaleFade,
  Modal,
  ModalOverlay,
  SlideFade,
  Text,
  Switch,
  Box,
  Input,
  Flex,
  Button,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { SupportFilter } from "./SupportFilter/SupportFilter"
import { FilterModalContent } from "./FilterModalContent/FilterModalContent"
import { FilterModalHeader } from "./FilterModalHeader/FilterModalHeader"
import { SaveFilterModal } from "./SaveFilterModal/SaveFilterModal"

export const FilterModal = ({
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
  const [showAuxContent, setShowAuxContent] = useState(false)
  const [showSaveFilter, setShowSaveFilter] = useState(false)
  const initialValues = {
    project: "",
    test_system: "",
    client: "",
    dates: [""],
    users: [""],
    vti_code: [""],
    project_tags: [""],
    note_tags: [""],
    only_suscribed: false,
    only_favs: false,
    only_unread: false,
    with_links: false,
    formalized: false,
    closed: false,
    with_responses: false,
  }
  const [filterValues, setFilterValues] = useState(initialValues)

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay />
      <FilterModalContent>
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
      </FilterModalContent>
    </Modal>
  )
}
