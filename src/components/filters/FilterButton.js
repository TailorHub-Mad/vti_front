import { Button } from "@chakra-ui/react"
import React from "react"
import { FilterIcon } from "../icons/FilterIcon"

export const FilterButton = ({onFilter}) => {

  return (
    <>
      <Button
        variant="tool_button"
        marginRight="16px"
        onClick={onFilter}
      >
        <FilterIcon mr={["8px", "8px"]} display />
        Filtrar
      </Button>
    </>
  )
}
