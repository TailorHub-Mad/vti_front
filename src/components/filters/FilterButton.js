import { CloseIcon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"
import React from "react"
import { FilterIcon } from "../icons/FilterIcon"

export const FilterButton = ({ onFilter, active }) => {
  return (
    <>
      <Button
        variant="tool_button"
        marginRight="16px"
        onClick={onFilter}
        background={active ? "#052E57" : "#FFF"}
        color={active ? "#FFF" : "#052E57"}
        isDisabled // TODO -> provisional
      >
        {active ? (
          <CloseIcon h="14px" mr={["8px", "8px"]} />
        ) : (
          <FilterIcon mr={["8px", "8px"]} display />
        )}
        Filtrar
      </Button>
    </>
  )
}
