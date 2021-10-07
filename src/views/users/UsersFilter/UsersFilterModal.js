import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useState } from "react"
import { MainFilter } from "./MainFilter/MainFilter"

import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"

export const UsersFilterModal = ({ isOpen, onClose, onFilter, ...props }) => {
  const [showMainContent] = useState(true)

  const initialValues = {
    project: [""],
    department: [""],
    focus_point: [""]
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
        <ScaleFade in={showMainContent}>
          <MainFilter
            simpleFilterValues={filterValues}
            onClose={onClose}
            onSimpleFilterChange={(val) => setFilterValues(val)}
            onFilter={() => onFilter(filterValues)}
            onReset={handleReset}
          />
        </ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
