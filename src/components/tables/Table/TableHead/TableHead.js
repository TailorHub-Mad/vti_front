import { Flex, Grid, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../../utils/constants/tables"

export const TableHead = ({ templateColumns, head, handleSortElement }) => {
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
      zIndex="10000"
      gridColumnGap={`${((32 / MIN_TABLE_WIDTH) * 100).toFixed(2)}%`}
      alignItems="center"
      minWidth={MIN_TABLE_WIDTH}
      maxWidth={MAX_TABLE_WIDTH}
    >
      {Object.values(head).map((element, idx) => {
        const [active, setActive] = useState(false)

        const handleOnClick = () => {
          setActive(!active)
          handleSortElement({
            name: element?.config?.name,
            order: active ? "asc" : "desc"
          })
        }

        return (
          <Flex
            key={`${element?.label}-${idx}`}
            alignItems="center"
            onClick={handleOnClick}
            cursor={element?.config?.sort ? "pointer" : "default"}
          >
            <Text
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
              variant="d_xs_medium"
              color="grey"
            >
              {element?.label.toString().toUpperCase()}
            </Text>
          </Flex>
        )
      })}
    </Grid>
  )
}
