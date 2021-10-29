import { CloseIcon } from "@chakra-ui/icons"
import { Flex, Grid, Text } from "@chakra-ui/layout"
import React from "react"
import { fetchType } from "../../../utils/constants/swr"
import { MAX_TABLE_WIDTH, MIN_TABLE_WIDTH } from "../../../utils/constants/tables"
import { GroupNotesRow } from "./GroupNotesRow"
import { groupTable } from "./utils"

export const NotesGroup = ({
  notes,
  onSeeDetails,
  checkIsSubscribe,
  checkIsFavorite,
  onDelete,
  onGroup,
  onFilter,
  handleFavorite,
  groupOption,
  fetchState,
  handleSubscribe,
  queryFilter,
  queryGroup
}) => {
  const formatNotes = groupTable(notes)

  return (
    <>
      <Flex align="center" gridGap="24px">
        {(fetchState === fetchType.GROUP || queryGroup) &&
        formatNotes?.length > 0 ? (
          <Flex
            alignItems="center"
            mb="24px"
            cursor="pointer"
            onClick={() => onGroup(null)}
          >
            <CloseIcon mr="8px" h="12px" />
            <Text marginTop="6px">{`Agrupado por ${groupOption
              .toString()
              .toUpperCase()}`}</Text>
          </Flex>
        ) : null}

        {(fetchState === fetchType.FILTER || queryFilter) &&
        formatNotes?.length > 0 ? (
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
      </Flex>

      <Flex overflow="hidden" width="100%" position="relative">
        <Grid minWidth={MIN_TABLE_WIDTH} maxWidth={MAX_TABLE_WIDTH} width="100%">
          {formatNotes?.map((item, idx) => {
            return (
              <GroupNotesRow
                key={`${item.key}-${idx}`}
                item={item}
                onSeeDetails={(note) => onSeeDetails(note, item.key)}
                checkIsSubscribe={checkIsSubscribe}
                checkIsFavorite={checkIsFavorite}
                onDelete={(value) => onDelete(value, item.key)}
                handleFavorite={handleFavorite}
                handleSubscribe={handleSubscribe}
              />
            )
          })}
        </Grid>
      </Flex>
    </>
  )
}
