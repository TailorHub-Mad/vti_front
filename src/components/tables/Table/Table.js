import { Box, Flex, Grid } from "@chakra-ui/react"
import React from "react"
import { CUSTOM_SCROLLBAR } from "../../../theme/utils/utils.theme"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/layout"
import { Card } from "../../cards/Card"

import { TableGroup } from "./TableGroup/TableGroup"
import { TableHead } from "./TableHead/TableHead"
import { TableRow } from "./TableRow.js/TableRow"

export const Table = ({
  onRowSelect,
  header,
  selectedRows,
  config,
  content,
  tableHeight,
  isGrouped,
  ...props
}) => {
  const { head, components } = config
  const templateColumns = Object.values(head).reduce(
    (ac, cv) => (ac = `${ac} ${cv.width}`),
    ""
  )
  const isSelected = (id) => !!selectedRows[id]

  return content ? (
    <Card
      width="100%"
      maxWidth={MAX_TABLE_WIDTH}
      position="relative"
      bgColor="white"
      sx={CUSTOM_SCROLLBAR}
      {...props}
    >
      {header ? <Box>{header}</Box> : null}

      <Flex
        overflow="scroll"
        width="100%"
        maxHeight={tableHeight || `calc(100vh - ${header ? "310px" : "230px"})`}
        position="relative"
        sx={CUSTOM_SCROLLBAR}
      >
        <Grid minWidth={MIN_TABLE_WIDTH} maxWidth={MAX_TABLE_WIDTH} width="100%">
          <TableHead templateColumns={templateColumns} head={head} />
          {isGrouped
            ? content.map((item, idx) => {
                return (
                  <TableGroup
                    key={`it-${idx}`}
                    item={item}
                    templateColumns={templateColumns}
                    idx={idx}
                    components={components}
                    onRowSelect={(id) => onRowSelect(id)}
                    selectedRows={selectedRows}
                    head={head}
                  />
                )
              })
            : content.map((item, idx) => {
                return (
                  <TableRow
                    key={item._id || item.id || `it-${idx}`}
                    item={item}
                    templateColumns={templateColumns}
                    isSelected={isSelected(item._id || item.id)}
                    idx={idx}
                    components={components}
                    onRowSelect={() => onRowSelect(item._id || item.id)}
                    selectedRows={selectedRows}
                    head={head}
                  />
                )
              })}
        </Grid>
      </Flex>
    </Card>
  ) : (
    <></>
  )
}
