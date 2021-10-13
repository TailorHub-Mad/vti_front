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
  fetchState
}) => {
  const formatNotes = groupTable(notes)

  const handleOnClick = () => {
    if (fetchState === fetchType.GROUP) return onGroup(null)
    if (fetchState === fetchType.FILTER) return onFilter(null)
  }

  console.log(fetchState, "codicieon", fetchState === fetchType.GROUP)

  return (
    <>
      {fetchState === fetchType.GROUP ? (
        <Flex alignItems="center" mb="24px" cursor="pointer" onClick={handleOnClick}>
          <CloseIcon mr="8px" h="12px" />
          <Text marginTop="6px">{`Agrupado por ${groupOption
            .toString()
            .toUpperCase()}`}</Text>
        </Flex>
      ) : null}

      {fetchState === fetchType.FILTER ? (
        <Flex alignItems="center" onClick={handleOnClick} cursor="pointer">
          <CloseIcon mr="8px" h="12px" />
          <Text marginTop="6px">{`Eliminar filtro`}</Text>
        </Flex>
      ) : null}

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
                onDelete={(value) => onDelete(value, item.key)}
                handleFavorite={handleFavorite}
              />
            )
          })}
        </Grid>
      </Flex>
    </>
  )
}
