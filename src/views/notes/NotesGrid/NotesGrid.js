import { Grid } from "@chakra-ui/layout"
import React from "react"
import { MessageCard } from "../../../components/cards/MessageCard/MessageCard"

export const NotesGrid = ({
  notes,
  onSeeDetails,
  checkIsSubscribe,
  checkIsFavorite,
  onDelete,
  handleFavorite,
  handleSubscribe
}) => {
  return (
    <Grid
      templateColumns="repeat(auto-fill, 282px)"
      gap="16px"
      width="100%"
      marginBottom="32px"
    >
      {notes.map((note, idx) => (
        <MessageCard
          key={`${note.title}-${idx}`}
          note={note}
          onSeeDetails={() => onSeeDetails(note)}
          subscribedUsers={null} // TODO -> review
          isSubscribe={checkIsSubscribe(note._id)}
          isFavorite={checkIsFavorite(note._id)}
          onDelete={() => onDelete(note._id)}
          handleFavorite={(state) => handleFavorite(note._id, state)}
          handleSubscribe={(state) => handleSubscribe(note._id, state)}
        />
      ))}
    </Grid>
  )
}
