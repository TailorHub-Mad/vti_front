import { ScaleFade, Modal, ModalOverlay } from "@chakra-ui/react"
import React, { useState } from "react"
import { MainFilter } from "./MainFilter/MainFilter"

import { CustomModalContent } from "../../../components/overlay/Modal/CustomModalContent/CustomModalContent"

export const UsersFilterModal = ({ isOpen, onClose, onFilter }) => {
  const [showMainContent] = useState(true)

  const initialValues = {
    project: [{ label: "", value: "" }],
    department: [{ label: "", value: "" }],
    focus_point: [{ label: "", value: "" }]
  }
  const [filterValues, setFilterValues] = useState(initialValues)

  const handleOnReset = () => {
    setFilterValues(initialValues)
    onFilter(null)
  }

  const handleOnFilter = () => {
    setFilterValues(initialValues)
    onFilter(filterValues)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <CustomModalContent>
        <ScaleFade in={showMainContent}>
          <MainFilter
            simpleFilterValues={filterValues}
            onClose={onClose}
            onSimpleFilterChange={(val) => setFilterValues(val)}
            onFilter={() => handleOnFilter()}
            onReset={handleOnReset}
          />
        </ScaleFade>
      </CustomModalContent>
    </Modal>
  )
}
