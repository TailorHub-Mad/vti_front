import { Flex, Grid, Text } from "@chakra-ui/react"
import React from "react"
import { CUSTOM_SCROLLBAR } from "../../../theme/utils/utils.theme"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/layout"
import { Card } from "../../layout/Card/Card"

export const Table = ({ selectedRows, onRowSelect, config, content, ...props }) => {
  const { head, components } = config
  const templateColumns = Object.values(head).reduce(
    (ac, cv) => (ac = `${ac} ${cv.width}`),
    ""
  )
  const isSelected = (idx) => selectedRows?.includes(idx)

  return (
    <Card width="100%" maxWidth="2400px" position="relative" {...props}>
      <Flex
        overflow="scroll"
        width="100%"
        maxHeight="90vh"
        position="relative"
        _css={CUSTOM_SCROLLBAR}
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
            alignItems="center"
            minWidth={MIN_TABLE_WIDTH}
            maxWidth={MAX_TABLE_WIDTH}
          >
            {Object.values(head).map((element) => (
              <Text key={element.label}>{element.label}</Text>
            ))}
          </Grid>
          {content.map((item, idx) => {
            return (
              <Grid
                key={item.id}
                templateColumns={templateColumns}
                borderBottom="1px"
                borderColor="grey"
                height="60px"
                width="100%"
                alignItems="center"
                bgColor={isSelected(idx) ? "blue.100" : "white"}
                _hover={{ bgColor: "blue.100" }}
              >
                {Object.entries(item).map(([name, element]) => {
                  if (head[name].type === "text") {
                    return React.cloneElement(components.text, {
                      children: element.toString(),
                    })
                  }
                  if (head[name].type === "selector") {
                    return React.cloneElement(components[name], {
                      isChecked: isSelected(idx),
                      onChange: () => onRowSelect(idx),
                    })
                  }
                  if (head[name].type === "tagGroup") {
                    return React.cloneElement(components[name], {
                      tagsArr: element,
                    })
                  }
                  if (components[name] !== undefined) {
                    return React.cloneElement(components[name], {
                      children: element,
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
  )
}
