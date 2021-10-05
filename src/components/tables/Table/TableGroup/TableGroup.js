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
  optionsDisabled,
  isLastOne
}) => {
  const { isOpen, onToggle } = useDisclosure()

  const isSelected = (id) => !!selectedRows[id]

  // TODO -> review
  if (item.key === "undefined") return null
  return (
    <Box pb={isOpen ? "20px" : "10px"}>
      <Flex onClick={onToggle} cursor="pointer" align="center" padding="10px 0">
        <Text variant="d_s_medium">{item.key}</Text>
        <ChevronDownIcon />
      </Flex>
      {isOpen
        ? item.value.map((row, idx) => {
            return (
              <TableRow
                key={`${row.id.value}-${idx}`}
                item={row}
                templateColumns={templateColumns}
                isSelected={isSelected(row.id.value)}
                idx={idx}
                components={components}
                onRowSelect={() => onRowSelect(row.id.value)}
                selectedRows={selectedRows}
                head={head}
                isLastOne={isLastOne && idx === item.value.length - 1}
                optionsDisabled={optionsDisabled}
              />
            )
          })
        : null}
    </Box>
  )
}
