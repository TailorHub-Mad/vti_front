import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { ChevronDownIcon } from "../../../icons/ChevronDownIcon"
import { TableRow } from "../TableRow.js/TableRow"

export const TableGroup = ({
  item,
  templateColumns,
  components,
  onRowSelect,
  selectedRows,
  head,
}) => {
  const { isOpen, onToggle } = useDisclosure()
  const isSelected = (idx) => selectedRows?.includes(idx)
  //TODO Row selection
  return (
    <Box pb={isOpen ? "20px" : "10px"}>
      <Flex onClick={onToggle} cursor="pointer" align="center" padding="10px 0">
        <Text variant="d_s_medium">{item[0]}</Text>
        <ChevronDownIcon />
      </Flex>
      {isOpen
        ? item[1].map((row, idx) => (
            <TableRow
              key={row._id || row.id || `it-${idx}`}
              item={row}
              templateColumns={templateColumns}
              isSelected={isSelected(idx)}
              idx={idx}
              components={components}
              onRowSelect={onRowSelect}
              selectedRows={selectedRows}
              head={head}
            />
          ))
        : null}
    </Box>
  )
}
