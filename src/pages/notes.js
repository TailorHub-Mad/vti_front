import { SearchIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react"
import React from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { AddNoteIcon } from "../components/icons/AddNoteIcon"
import { FilterIcon } from "../components/icons/FilterIcon"
import { NotesIcon } from "../components/icons/NotesIcon"
import { UploadCloudIcon } from "../components/icons/UploadCloudIcon"
import { Page } from "../components/layout/Page/Page"
import { PageBody } from "../components/layout/PageBody/PageBody"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/PageMenu/PageMenu"
import { NotesMenu } from "../views/notes/NotesMenu/NotesMenu"
import { NotesToolBar } from "../views/notes/NotesToolBar/NotesToolBar"

const notes = () => {
  return (
    <Page>
      <PageHeader title="Apuntes">
        <NotesToolBar />
      </PageHeader>
      <PageMenu>
        <NotesMenu />
      </PageMenu>
      <PageBody>
        <Grid
          templateColumns="repeat(auto-fill, 282px)"
          gap="16px"
          width="100%"
          marginBottom="32px"
        >
          {new Array(50).fill("").map((mock) => (
            <MessageCard />
          ))}
        </Grid>
      </PageBody>
    </Page>
  )
}

export default notes
