import { Grid, Text } from "@chakra-ui/react"
import React from "react"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../../utils/constants/tables"

export const TableHead = ({ templateColumns, head }) => {
  return (
    <Grid
      templateColumns={templateColumns}
      borderBottom="1px solid #C9C9C9"
      padding="8px 0"
      width="100%"
      position="sticky"
      top="0"
      left="0"
      bgColor="white"
      zIndex="1"
      gridColumnGap="8px"
      alignItems="center"
      minWidth={MIN_TABLE_WIDTH}
      maxWidth={MAX_TABLE_WIDTH}
    >
      {Object.values(head).map((element, idx) => (
        <Text key={`${element?.label}-${idx}`}>{element?.label}</Text>
      ))}
    </Grid>
  )
}
