import { Grid } from "@chakra-ui/react"
import React, { useContext } from "react"
import { ApiAuthContext } from "../../../../provider/ApiAuthProvider"
import { RoleType } from "../../../../utils/constants/global"
import { MIN_TABLE_WIDTH } from "../../../../utils/constants/tables"
import { variantGeneralTag } from "../../../../utils/constants/tabs"
import { TableIcon } from "../TableIcon/TableIcon"

export const TableRow = ({
  item,
  keyGroup,
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

  const { user, role } = useContext(ApiAuthContext)

  const checkIsSubscribeSystem = (id) => user?.subscribed?.testSystems?.includes(id)

  const checkIsFavoriteProject = (id) => user?.favorites?.projects?.includes(id)
  const checkIsSubscribeProject = (id) => user?.subscribed?.projects?.includes(id)

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
      gridColumnGap={`${((32 / MIN_TABLE_WIDTH) * 100).toFixed(2)}%`}
      {...props}
    >
      {Object.entries(item).map(([name, element], idx) => {
        // TEXT
        if (head[name]?.type === "text") {
          return React.cloneElement(components[head[name]?.type], {
            children: element?.toString(),
            // textOverflow: "ellipsis",
            // whiteSpace: "nowrap",
            // overflow: "hidden",
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

            // textOverflow: "ellipsis",
            // whiteSpace: "nowrap",
            // overflow: "hidden",
            paddingRight: "10px",
            ...colorConfig
          })
        }

        // SELECTOR
        if (head[name]?.type === "selector") {
          const { code } = item

          return role === RoleType.ADMIN ? (
            React.cloneElement(components[head[name]?.type], {
              isChecked: isSelected,
              onChange: onRowSelect,
              key: `${name}-${idx}`,
              mb: "12px"
            })
          ) : (
            <TableIcon
              isSubscribe={
                code
                  ? checkIsSubscribeSystem(item.id.value)
                  : checkIsSubscribeProject(item.id.value)
              }
              isFavorite={code ? null : checkIsFavoriteProject(item.id.value)}
            />
          )
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
          const { code } = item

          return React.cloneElement(components[head[name]?.type], {
            ...head[name],
            id: item.id.value,
            keyGroup: keyGroup,
            key: `${name}-${idx}`,
            disabled: optionsDisabled,
            ...head[name].config,
            isSubscribe: code
              ? checkIsSubscribeSystem(item.id.value)
              : checkIsSubscribeProject(item.id.value),
            isFavorite: code ?? checkIsFavoriteProject(item.id.value)
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
