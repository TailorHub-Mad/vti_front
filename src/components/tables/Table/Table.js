import { Box, Flex, Grid } from "@chakra-ui/react"
import React from "react"
import { CUSTOM_SCROLLBAR } from "../../../theme/utils/utils.theme"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/tables"
import { Card } from "../../cards/Card"

import { TableGroup } from "./TableGroup/TableGroup"
import { TableHead } from "./TableHead/TableHead"
import { TableRow } from "./TableRow.js/TableRow"

export const Table = ({
  onRowSelect,
  header,
  selectedRows = {},
  config,
  content,
  tableHeight,
  isGrouped,
  optionsDisabled,
  handleSortElement,
  ...props
}) => {
  const { head, components } = config
  const templateColumns = Object.values(head).reduce(
    (ac, cv) => (ac = `${ac} ${cv.width}`),
    ""
  )
  const isSelected = (id) => !!selectedRows[id]

  return (
    <Card
      width="100%"
      maxWidth={MAX_TABLE_WIDTH}
      position="relative"
      bgColor="white"
      sx={CUSTOM_SCROLLBAR}
      {...props}
      overflow="hidden"
    >
      {header ? <Box>{header}</Box> : null}

      <Flex
        width="100%"
        maxHeight={tableHeight || `calc(100vh - ${header ? "310px" : "230px"})`}
        position="relative"
        sx={CUSTOM_SCROLLBAR}
        overflowY="auto"
      >
        <Grid
          minWidth={MIN_TABLE_WIDTH}
          maxWidth={MAX_TABLE_WIDTH}
          width="100%"
          height="fit-content"
          overflowY="auto"
        >
          <TableHead
            templateColumns={templateColumns}
            head={head}
            handleSortElement={handleSortElement}
          />
          {content?.map((item, idx) => {
            if (isGrouped)
              return (
                <TableGroup
                  key={`it-${idx}`}
                  keyGroup={item.key}
                  item={item}
                  templateColumns={templateColumns}
                  idx={idx}
                  components={components}
                  onRowSelect={(value) => onRowSelect(value, item.key)}
                  selectedRows={selectedRows}
                  head={head}
                  isLastOne={idx === content.length - 1}
                  optionsDisabled={optionsDisabled}
                />
              )
            return (
              <TableRow
                key={`${item.id.value}-${idx}`}
                item={item}
                templateColumns={templateColumns}
                isSelected={isSelected(item.id.value)}
                idx={idx}
                components={components}
                onRowSelect={() => onRowSelect(item.id.value)}
                selectedRows={selectedRows}
                head={head}
                isLastOne={idx === content.length - 1}
                optionsDisabled={optionsDisabled}
              />
            )
          })}
        </Grid>
      </Flex>
    </Card>
  )
}
