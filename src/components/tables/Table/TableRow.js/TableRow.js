import { Grid } from "@chakra-ui/react"
import React from "react"
import { variantGeneralTag } from "../../../../utils/constants/tabs"

export const TableRow = ({
  item,
  templateColumns,
  isSelected,
  components,
  onRowSelect,
  selectedRows,
  head,
  isLastOne,
  optionsDisabled,
  ...props
}) => {
  const { isFinished } = item?.config || {}
  const colorConfig = { color: isFinished ? "correct.500" : "blue.500" }

  return (
    <Grid
      templateColumns={templateColumns}
      borderBottom={isLastOne ? "none" : "1px solid rgba(201, 201, 201, 0.16)"}
      height="fit-content"
      width="100%"
      alignItems="center"
      padding="16px 0"
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
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            key: `${name}-${idx}`,
            ...colorConfig
          })
        }

        // COUNT
        if (head[name]?.type === "count") {
          return React.cloneElement(components[head[name]?.type], {
            children: element?.length.toString(),
            textAlign: "left",
            key: `${name}-${idx}`
          })
        }

        // LINK ITEM
        if (head[name]?.type === "link") {
          return React.cloneElement(components[head[name]?.type], {
            children: element?.label?.toString(),
            url: element?.link,
            key: `${name}-${idx}`,

            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            paddingRight: "10px",
            ...colorConfig
          })
        }

        // SELECTOR
        if (head[name]?.type === "selector") {
          return React.cloneElement(components[head[name]?.type], {
            isChecked: isSelected,
            onChange: onRowSelect,
            key: `${name}-${idx}`
          })
        }

        // TAGS
        if (head[name]?.type === "tags") {
          return React.cloneElement(components[head[name]?.type], {
            tags: element,
            key: `${name}-${idx}`,
            variant: isFinished
              ? variantGeneralTag.FINISH
              : head[name].config?.variant
          })
        }

        if (head[name]?.type === "options") {
          return React.cloneElement(components[head[name]?.type], {
            ...head[name],
            id: item.id.value,
            key: `${name}-${idx}`,
            disabled: optionsDisabled,
            ...head[name].config
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
