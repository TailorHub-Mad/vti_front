import { Box, Button, Collapse, Flex, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { CollapseIconVert } from "../../../../components/icons/CollapseIconVert"
import { PeopleLineIcon } from "../../../../components/icons/PeopleLineIcon"
import { TagLineIcon } from "../../../../components/icons/TagLineIcon"
import { TestSystemLineIcon } from "../../../../components/icons/TestSystemLineIcon"
import { PATHS } from "../../../../utils/constants/global"
import Link from "next/link"
import { Tag } from "../../../../components/tags/Tag/Tag"
import { formatTags, variantGeneralTag } from "../../../../utils/constants/tabs"
import { CalendarIcon } from "@chakra-ui/icons"
import { TagRow } from "../../../../components/tags/TagRow/TagRow"

export const ProjectDetails = ({
  focusPoint,
  testSystems,
  closeInfo,
  tags,
  users,
  projectId
}) => {
  const [showProjectDetails, setShowProjectDetails] = useState(true)

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
        {closeInfo && (
          <Box mt="16px" mb="32px">
            <Flex align="center" mb="8px">
              <CalendarIcon mr="8px" />
              <Text variant="d_m_regular">Fecha de cierre</Text>
            </Flex>
            {focusPoint && (
              <Tag
                variant={variantGeneralTag.PROJECT}
                ml="32px"
                width="80px"
                noCollapse
              >
                {`${closeInfo.day.padStart(2, 0)}/${closeInfo.month.padStart(
                  2,
                  0
                )}/${closeInfo.year}`}
              </Tag>
            )}
          </Box>
        )}

        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <PeopleLineIcon mr="8px" />
            <Text variant="d_m_regular">Punto focal del proyecto</Text>
          </Flex>
          {focusPoint && (
            <Tag variant={variantGeneralTag.PROJECT} ml="32px">
              {focusPoint}
            </Tag>
          )}
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <PeopleLineIcon mr="8px" />
            <Text variant="d_m_regular">Usuarios del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            {users &&
              users.map((user, idx) => (
                <Tag
                  key={`${user}-${idx}`}
                  mr="8px"
                  variant={variantGeneralTag.NOTE}
                >
                  {user.alias}
                </Tag>
              ))}
          </Flex>
        </Box>
        <Box mt="16px" mb="32px">
          <Flex align="center" mb="8px">
            <TagLineIcon mr="8px" />
            <Text variant="d_m_regular">Tags del proyecto</Text>
          </Flex>
          <Flex ml="32px">
            <TagRow
              tags={formatTags(tags, "name")}
              variant={variantGeneralTag.NOTE}
              width="100%"
              noCollapse
            />
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
                <Link
                  key={ts._id}
                  href={`${PATHS.projects}/${projectId}/${ts._id}`}
                  passHref
                >
                  <Button variant="note_content" maxW="500px" mr="8px" mb="8px">
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
