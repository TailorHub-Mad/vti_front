import { Flex, Grid, Text } from "@chakra-ui/react"
import React from "react"
import { MessageCard } from "../../../../components/cards/MessageCard/MessageCard"
import { PageBody } from "../../../../components/layout/PageBody/PageBody"
import { ToolBar } from "../../../../components/navigation/ToolBar/ToolBar"
import { NOTES_MOCK } from "../../../../mock/notes"

export const ProjectNotes = ({ notes = [], showNoteDetails }) => {
  //TODO pasar notes por props
  return (
    <>
      <Flex justify="space-between" align="center" mt="24px" mb="24px">
        <Text variant="d_l_regular">Apuntes</Text>
        <Flex width="fit-content">
          <ToolBar />
        </Flex>
      </Flex>
      <PageBody height="calc(100vh - 260px)">
        <Grid
          templateColumns="repeat(auto-fill, 282px)"
          gap="16px"
          width="100%"
          marginBottom="32px"
        >
          {[...NOTES_MOCK].slice(0, 12).map((mock, idx) => (
            <MessageCard
              {...mock}
              key={idx}
              onSeeDetails={() => showNoteDetails(idx)}
              _hover={{ border: "1px solid", borderColor: "start" }}
            />
          ))}
        </Grid>
      </PageBody>
    </>
  )
}
