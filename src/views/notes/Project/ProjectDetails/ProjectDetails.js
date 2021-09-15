import { Box, Button, Collapse, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { CollapseIconVert } from "../../../../components/icons/CollapseIconVert"
import { PeopleLineIcon } from "../../../../components/icons/PeopleLineIcon"
import { TagLineIcon } from "../../../../components/icons/TagLineIcon"
import { TestSystemLineIcon } from "../../../../components/icons/TestSystemLineIcon"
import { NoteTag } from "../../../../components/tags/NoteTag/NoteTag"
import { ProjectTag } from "../../../../components/tags/ProjectTag/ProjectTag"
import { TestSystemTag } from "../../../../components/tags/TestSystemTag/TestSystemTag"
import { PATHS } from "../../../../utils/constants/paths"
import Link from "next/link"

export const ProjectDetails = ({ focusPoint, testSystems, tags, users }) => {
  const [showProjectDetails, setShowProjectDetails] = useState(false)

  return (
    <Box mt="32px">
      <Flex
        align="center"
        cursor="pointer"
        onClick={() => setShowProjectDetails(!showProjectDetails)}
        width="fit-content"
      >
        <Text variant="d_l_regular">Sobre el proyecto</Text>
        <CollapseIconVert />
      </Flex>
      <Collapse in={showProjectDetails} animateOpacity>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <PeopleLineIcon mr="8px" />
            <Text variant="d_m_regular">Punto focal del proyecto</Text>
          </Flex>
          {focusPoint && <ProjectTag ml="32px">{focusPoint}</ProjectTag>}
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <PeopleLineIcon mr="8px" />
            <Text variant="d_m_regular">Usuarios del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            {users &&
              users.map((user, idx) => (
                <NoteTag key={`${user}-${idx}`} mr="8px">
                  {user}
                </NoteTag>
              ))}
          </Flex>
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <TagLineIcon mr="8px" />
            <Text variant="d_m_regular">Tags del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            {tags?.length > 0 &&
              tags.map((tag, idx) => (
                <TestSystemTag key={`${tag}-${idx}`} mr="8px">
                  {tag}
                </TestSystemTag>
              ))}
          </Flex>
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <TestSystemLineIcon mr="8px" />
            <Text variant="d_m_regular">Sistemas de ensayo del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            {testSystems &&
              testSystems.map((ts) => (
                <Link key={ts._id} href={`${PATHS.testSystems}/${ts._id}`} passHref>
                  <Button variant="note_content" mr="8px" mb="8px">
                    {ts.alias}
                  </Button>
                </Link>
              ))}
          </Flex>
        </Box>
      </Collapse>
    </Box>
  )
}
