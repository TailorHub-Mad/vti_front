import {
  ScaleFade,
  Modal,
  ModalOverlay,
  SlideFade,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { AuxFilter } from "./AuxFilter/AuxFilter"
import { MainFilter } from "./MainFilter/MainFilter"
import { SupportFilter } from "./SupportFilter/SupportFilter"
import { FilterModalContent } from "./FilterModalContent/FilterModalContent"

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
        <ScaleFade in={showMainContent && !showSecondaryContent}>
          <MainFilter
            simpleFilterValues={filterValues}
            onClose={onClose}
            onSecondaryOpen={() => setShowSecondaryContent(true)}
            onSimpleFilterChange={(val) => setFilterValues(val)}
          />
        </ScaleFade>
        <ScaleFade in={showSecondaryContent}>
          <SupportFilter
            onClose={() => setShowSecondaryContent(false)}
            onSecondaryOpen={() => setShowAuxContent(true)}
            isAuxOpen={showAuxContent}
          />
        </ScaleFade>
        <SlideFade
          in={showAuxContent && showSecondaryContent}
          offsetX="150px"
          offsetY="0"
        >
          <AuxFilter onClose={() => setShowAuxContent(false)} />
        </SlideFade>
      </FilterModalContent>
    </Modal>
  )
}
