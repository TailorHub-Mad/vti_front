import { Flex, Grid } from "@chakra-ui/layout"
import React from "react"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/tables"
import { GroupNotesRow } from "./GroupNotesRow"
import { groupTable } from "./utils"

export const NotesGroup = ({
  notes,
  onSeeDetails,
  checkIsSubscribe,
  checkIsFavorite,
  onDelete,
  handleFavorite
}) => {
  const formatNotes = groupTable(notes)

  return (
    <Flex overflow="hidden" width="100%" position="relative">
      <Grid minWidth={MIN_TABLE_WIDTH} maxWidth={MAX_TABLE_WIDTH} width="100%">
        {formatNotes.map((item, idx) => {
          return (
            <GroupNotesRow
              key={`${item.key}-${idx}`}
              item={item}
              onSeeDetails={onSeeDetails}
              subscribedUsers={null} // TOPO -> review
              checkIsSubscribe={checkIsSubscribe}
              checkIsFavorite={checkIsFavorite}
              onDelete={onDelete}
              handleFavorite={handleFavorite}
            />
          )
        })}
      </Grid>
    </Flex>
  )
}
