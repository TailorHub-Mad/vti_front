import { Grid, Text } from "@chakra-ui/react"
import React from "react"

export const TableRow = ({
  item,
  templateColumns,
  isSelected,
  components,
  onRowSelect,
  selectedRows,
  head,
  ...props
}) => {
  const { isFinished } = item.config
  const colorConfig = { color: isFinished ? "correct.500" : "blue.500" }
  const bgColorConfig = isFinished ? { variant: "green" } : {}
  return (
    <Grid
      templateColumns={templateColumns}
      borderBottom="1px"
      borderColor="grey"
      height="fit-content"
      width="100%"
      alignItems="center"
      padding="21px 0"
      bgColor={isSelected ? "blue.100" : "white"}
      _hover={{ bgColor: "blue.100" }}
      gridColumnGap="8px"
      {...props}
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
            url: element?.link,
            ...colorConfig,
          })
        }
        if (head[name]?.type === "selector") {
          return React.cloneElement(components[name], {
            isChecked: isSelected,
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
            disabled: selectedRows.length > 1,
            key: `${name}-${idx}`,
          })
        }
        return <Text key={`${name}-${idx}`} />
      })}
    </Grid>
  )
}
