import { useDisclosure } from "@chakra-ui/hooks"
import { Box, Flex, Text } from "@chakra-ui/layout"
import React from "react"
import { ChevronDownIcon } from "../../../components/icons/ChevronDownIcon"
import { NotesGrid } from "../NotesGrid/NotesGrid"

export const GroupNotesRow = ({
  item,
  onSeeDetails,
  checkIsSubscribe,
  checkIsFavorite,
  onDelete,
  handleFavorite
}) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
      <Box pb={isOpen ? "20px" : "10px"}>
        <Flex onClick={onToggle} cursor="pointer" align="center" padding="10px 0">
          <Text variant="d_s_medium">{item.key}</Text>
          <ChevronDownIcon />
        </Flex>
        {isOpen ? (
          <NotesGrid
            notes={item.value}
            onSeeDetails={onSeeDetails}
            subscribedUsers={null} // TOPO -> review
            checkIsSubscribe={checkIsSubscribe}
            checkIsFavorite={checkIsFavorite}
            onDelete={onDelete}
            handleFavorite={handleFavorite}
          />
        ) : null}
      </Box>
    </>
  )
}
