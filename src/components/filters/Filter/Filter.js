import { Button, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { FilterIcon } from "../../icons/FilterIcon"
import { FilterModal } from "./FilterModal/FilterModal"

export const Filter = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <>
      <Button variant="tool_button" marginRight="16px" onClick={onOpen}>
        <FilterIcon mr={["8px", "0"]} display />
        Filtrar
      </Button>
      <FilterModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
