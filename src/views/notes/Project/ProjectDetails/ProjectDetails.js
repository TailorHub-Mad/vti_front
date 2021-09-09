import { Box, Button, Collapse, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { CollapseIconVert } from "../../../../components/icons/CollapseIconVert"
import { PeopleLineIcon } from "../../../../components/icons/PeopleLineIcon"
import { TagLineIcon } from "../../../../components/icons/TagLineIcon"
import { TestSystemLineIcon } from "../../../../components/icons/TestSystemLineIcon"
import { NoteTag } from "../../../../components/tags/NoteTag/NoteTag"
import { ProjectTag } from "../../../../components/tags/ProjectTag/ProjectTag"
import { TestSystemTag } from "../../../../components/tags/TestSystemTag/TestSystemTag"

export const ProjectDetails = () => {
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
          <ProjectTag ml="32px">Persona X</ProjectTag>
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <PeopleLineIcon mr="8px" />
            <Text variant="d_m_regular">Usuarios del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            <NoteTag mr="8px">Persona X</NoteTag>
            <NoteTag mr="8px">Persona X</NoteTag>
            <NoteTag mr="8px">Persona X</NoteTag>
            <NoteTag mr="8px">Persona X</NoteTag>
            <NoteTag mr="8px">Persona X</NoteTag>
            <NoteTag mr="8px">Persona X</NoteTag>
            <NoteTag mr="8px">Persona X</NoteTag>
          </Flex>
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <TagLineIcon mr="8px" />
            <Text variant="d_m_regular">Tags del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            <TestSystemTag mr="8px">Persona X</TestSystemTag>
            <TestSystemTag mr="8px">Persona X</TestSystemTag>
            <TestSystemTag mr="8px">Persona X</TestSystemTag>
          </Flex>
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <TestSystemLineIcon mr="8px" />
            <Text variant="d_m_regular">Sistemas de ensayo del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            <Button variant="note_content" mr="8px" mb="8px">
              Sistema de ensayo 1
            </Button>
            <Button variant="note_content" mr="8px" mb="8px">
              Sistema de ensayo 2
            </Button>
            <Button variant="note_content" mr="8px" mb="8px">
              Sistema de ensayo 3
            </Button>
          </Flex>
        </Box>
      </Collapse>
    </Box>
  )
}
