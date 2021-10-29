import { CloseIcon } from "@chakra-ui/icons"
import { Grid, Flex } from "@chakra-ui/layout"
import { Text } from "@chakra-ui/react"
import React from "react"
import { MessageCard } from "../../../components/cards/MessageCard/MessageCard"
import { fetchType } from "../../../utils/constants/swr"

export const NotesGrid = ({
  notes,
  onSeeDetails,
  checkIsSubscribe,
  checkIsFavorite,
  onDelete,
  handleFavorite,
  handleSubscribe,
  fromProjectDetail,
  notesFromSubscription,
  queryFilter,
  fetchState,
  onFilter
}) => {
  return (
    <>
      {(fetchState === fetchType.FILTER || queryFilter) && notes?.length > 0 ? (
        <Flex
          alignItems="center"
          onClick={() => onFilter(null)}
          cursor="pointer"
          mb="24px"
        >
          <CloseIcon mr="8px" h="12px" />
          <Text marginTop="6px">{`Eliminar filtro`}</Text>
        </Flex>
      ) : null}

      <Grid
        templateColumns="repeat(auto-fill, 282px)"
        gap="16px"
        width="100%"
        marginBottom="24px"
      >
        {notes?.map((note, idx) => (
          <MessageCard
            key={`${note.title}-${idx}`}
            note={note}
            onSeeDetails={() => onSeeDetails(note)}
            isSubscribe={checkIsSubscribe(note._id)}
            isFavorite={checkIsFavorite(note._id)}
            onDelete={() => onDelete(note._id)}
            handleFavorite={(state) => handleFavorite(note._id, state)}
            handleSubscribe={(state) => handleSubscribe(note._id, state)}
            fromProjectDetail={fromProjectDetail}
            notesFromSubscription={notesFromSubscription}
          />
        ))}
      </Grid>
    </>
  )
}
