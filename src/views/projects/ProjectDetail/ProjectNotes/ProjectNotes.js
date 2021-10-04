import { Flex, Grid, Text } from "@chakra-ui/react"
import React from "react"
import { MessageCard } from "../../../../components/cards/MessageCard/MessageCard"
import { PageBody } from "../../../../components/layout/Pages/PageBody/PageBody"
import { ToolBar } from "../../../../components/navigation/ToolBar/ToolBar"

export const ProjectNotes = ({ showNoteDetails, notes = [] }) => {
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
          {notes.slice(0, 12).map((note, idx) => (
            <MessageCard
              key={`${note.title}-${idx}`}
              note={note}
              onSeeDetails={() => showNoteDetails(note)}
              // subscribedUsers={null} // TOPO -> review
              // isSubscribe={checkIsSubscribe(note._id)}
              // isFavorite={checkIsFavorite(note._id)}
              // onDelete={() => onDelete(note._id)}
              // handleFavorite={(state) => handleFavorite(note._id, state)}
            />
          ))}
        </Grid>
      </PageBody>
    </>
  )
}
