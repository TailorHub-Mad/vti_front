import { CloseIcon } from "@chakra-ui/icons"
import { Button, useDisclosure, Flex, Text } from "@chakra-ui/react"
import React from "react"
import { NotesIcon } from "../icons/NotesIcon"
import { GroupModal } from "./GroupModal/GroupModal"

export const Group = ({ onGroup, options, active, isDisabled, isMobile }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  const handleOnGroup = (activeItem) => {
    onGroup(activeItem)
    onClose()
  }

  const handleOnClick = () => {
    if (active) return onGroup(null)
    onOpen()
  }

  return (
    <>
      {isMobile ? (
        <Flex align="center" color="white" gridGap="8px" onClick={handleOnClick}>
          <NotesIcon />
          <Text color="white" mt="4px" variant="d_s_medium">
            Agrupar
          </Text>
        </Flex>
      ) : (
        <Button
          variant="tool_button"
          mr="16px"
          onClick={handleOnClick}
          background={active ? "#052E57" : "#FFF"}
          color={active ? "#FFF" : "#052E57"}
          isDisabled={isDisabled}
        >
          {active ? (
            <CloseIcon h="14px" mr={["8px", "8px"]} />
          ) : (
            <NotesIcon mr={["8px", "8px"]} />
          )}
          Agrupar
        </Button>
      )}
      <GroupModal
        isOpen={isOpen}
        onClose={onClose}
        onGroup={handleOnGroup}
        options={options}
      />
    </>
  )
}
