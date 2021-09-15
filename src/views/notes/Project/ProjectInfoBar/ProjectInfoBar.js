import { Flex, Text } from "@chakra-ui/react"
import React from "react"

export const ProjectInfoBar = ({ projectInfo, updatedAt, ...props }) => {
  return (
    <Flex {...props}>
      {projectInfo.map((item) => (
        <>
          <Text mr="16px">{item}</Text>
          <Text mr="16px">·</Text>
        </>
      ))}
      <Text mr="16px" color="blue.400">
        Última actualización: {updatedAt?.toLocaleDateString()}
      </Text>
    </Flex>
  )
}
