import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const ProjectInfoBar = ({ projectInfo, updatedAt, ...props }) => {
  return (
    <>
      <Flex
        {...props}
        flexDirection={["column", null, null, "row"]}
        gridGap={["16px", null, null, "0"]}
      >
        {projectInfo.map((item, idx) => (
          <Flex
            key={`${item}-${idx}`}
            alignItems={["flex-start", null, null, "center"]}
            flexDirection={["column", null, null, "row"]}
          >
            <Text mr="16px">{item}</Text>
            <Text display={["none", null, null, "block"]} mr="16px">
              ·
            </Text>
          </Flex>
        ))}
        <Text mr="16px" color="blue.400">
          Última actualización: {updatedAt?.toLocaleDateString()}
        </Text>
      </Flex>
    </>
  )
}
