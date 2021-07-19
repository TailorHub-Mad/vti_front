/* eslint-disable react/no-children-prop */
import { SearchIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react"
import React from "react"
import { AddNoteIcon } from "../../icons/AddNoteIcon"
import { FilterIcon } from "../../icons/FilterIcon"
import { NotesIcon } from "../../icons/NotesIcon"
import { UploadCloudIcon } from "../../icons/UploadCloudIcon"

export const PageHeader = ({ title, children, ...props }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      height="56px"
      marginBottom="16px"
      {...props}
    >
      <Text variant="d_l_medium">{title}</Text>
      <Flex width="fit-content">{children}</Flex>
    </Flex>
  )
}
