import { Box, Flex, Grid, Text } from "@chakra-ui/react"
import { unique } from "faker"
import React from "react"
import { CUSTOM_SCROLLBAR } from "../../../theme/utils/utils.theme"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/layout"
import { Card } from "../../layout/Card/Card"

export const Table = ({
  selectedRows,
  onRowSelect,
  header,
  config,
  content,
  tableHeight,
  ...props
}) => {
  const { head, components } = config
  const templateColumns = Object.values(head).reduce(
    (ac, cv) => (ac = `${ac} ${cv.width}`),
    ""
  )
  const isSelected = (idx) => selectedRows?.includes(idx)

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
          <Grid
            templateColumns={templateColumns}
            borderBottom="1px"
            borderColor="grey"
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
          {content.map((item, idx) => {
            const { isFinished } = item.config
            const colorConfig = { color: isFinished ? "correct.500" : "blue.500" }
            const bgColorConfig = isFinished ? { variant: "green" } : {}
            return (
              <Grid
                key={item._id || item.id || `it-${idx}`}
                templateColumns={templateColumns}
                borderBottom="1px"
                borderColor="grey"
                height="fit-content"
                width="100%"
                alignItems="center"
                padding="21px 0"
                bgColor={isSelected(idx) ? "blue.100" : "white"}
                _hover={{ bgColor: "blue.100" }}
                gridColumnGap="8px"
              >
                {/* TODO refactor del cloneElement para que reciba las props de forma más elegante */}
                {Object.entries(item).map(([name, element], idx) => {
                  if (head[name]?.type === "count") {
                    return React.cloneElement(components.text, {
                      children: element?.length.toString(),
                      textAlign: "left",
                      key: `${name}-${idx}`,
                      ...colorConfig,
                    })
                  }
                  if (head[name]?.type === "text") {
                    return React.cloneElement(components.text, {
                      children: element?.toString(),
                      key: `${name}-${idx}`,

                      ...colorConfig,
                    })
                  }
                  if (head[name]?.type === "link") {
                    return React.cloneElement(components.link, {
                      children: element?.label,
                      alias: element?.link,
                      key: `${name}-${idx}`,

                      ...colorConfig,
                    })
                  }
                  if (head[name]?.type === "selector") {
                    return React.cloneElement(components[name], {
                      isChecked: isSelected(idx),
                      onChange: () => onRowSelect(idx),
                      key: `${name}-${idx}`,
                    })
                  }
                  if (head[name]?.type === "tagGroup") {
                    return React.cloneElement(components[name], {
                      tagsArr: element,
                      key: `${name}-${idx}`,

                      ...bgColorConfig,
                    })
                  }
                  if (components[name] !== undefined) {
                    return React.cloneElement(components[name], {
                      children: element,
                      id: item.id,
                      alias: element?.alias,
                      key: `${name}-${idx}`,
                    })
                  }
                  return <Text key={name} />
                })}
              </Grid>
            )
          })}
        </Grid>
      </Flex>
    </Card>
  ) : (
    <></>
  )
}
