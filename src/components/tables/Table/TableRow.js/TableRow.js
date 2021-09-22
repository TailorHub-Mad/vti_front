import { Grid } from "@chakra-ui/react"
import React from "react"

export const TableRow = ({
  item,
  templateColumns,
  isSelected,
  components,
  onRowSelect,
  selectedRows,
  head,
  isLastOne,
  ...props
}) => {
  const { isFinished } = item?.config || {}
  const colorConfig = { color: isFinished ? "correct.500" : "blue.500" }
  const bgColorConfig = isFinished ? { variant: "green" } : {}

  return (
    <Grid
      templateColumns={templateColumns}
      borderBottom={isLastOne ? "none" : "1px"}
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
      {Object.entries(item).map(([name, element], idx) => {
        // TEXT
        if (head[name]?.type === "text") {
          return React.cloneElement(components[head[name]?.type], {
            children: element?.toString(),
            key: `${name}-${idx}`,
            ...colorConfig
          })
        }
        if (head[name]?.type === "mapText") {
          return React.cloneElement(components[head[name]?.type], {
            children: element?.label?.toString(),
            key: `${name}-${idx}`,
            ...colorConfig
          })
        }

        // COUNT
        if (head[name]?.type === "count") {
          return React.cloneElement(components[head[name]?.type], {
            children: element?.length.toString(),
            textAlign: "left",
            key: `${name}-${idx}`,
            ...colorConfig
          })
        }

        // LINK ITEM
        if (head[name]?.type === "link") {
          return React.cloneElement(components[head[name]?.type], {
            children: element?.label,
            alias: element?.link,
            key: `${name}-${idx}`,
            url: element?.link,
            ...colorConfig
          })
        }

        // SELECTOR
        if (head[name]?.type === "selector") {
          return React.cloneElement(components[head[name]?.type], {
            isChecked: isSelected,
            onChange: () => onRowSelect(idx),
            key: `${name}-${idx}`
          })
        }

        // TAGS
        if (head[name]?.type === "tags") {
          return React.cloneElement(components[head[name]?.type], {
            tagsArr: element,
            key: `${name}-${idx}`,
            ...bgColorConfig
          })
        }

        if (head[name]?.type === "options") {
          return React.cloneElement(components[head[name]?.type], {
            ...head[name],
            id: item.id.value,
            key: `${name}-${idx}`
          })
        }

        // DEFAULT
        if (head[name]?.type !== undefined) {
          return React.cloneElement(components[head[name]?.type], {
            children: element,
            id: item.id,
            alias: element?.alias,
            disabled: Object.keys(selectedRows).length > 1,
            key: `${name}-${idx}`
          })
        }

        return null
      })}
    </Grid>
  )
}
