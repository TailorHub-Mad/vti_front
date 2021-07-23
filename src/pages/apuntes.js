import { Button, Center, Grid, Spinner, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { AddNoteIcon } from "../components/icons/AddNoteIcon"
import { UploadCloudIcon } from "../components/icons/UploadCloudIcon"
import { Page } from "../components/layout/Page/Page"
import { PageBody } from "../components/layout/PageBody/PageBody"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/PageMenu/PageMenu"
import { NOTES_MOCK } from "../mock/notes"
import { NotesEmptyState } from "../views/notes/NotesEmptyState/NotesEmptyState"
import { NotesMenu } from "../views/notes/NotesMenu/NotesMenu"
import { NotesToolBar } from "../views/notes/NotesToolBar/NotesToolBar"

const apuntes = () => {
  // TODO fetch notes
  // const notes = null
  const isFetching = false
  const notes = new Array(50).fill("")
  const areNotes = notes && notes.length > 0
  const [activeTab, setActiveTab] = useState("all")
  return (
    <Page>
      <PageHeader title="Apuntes">
        {areNotes && !isFetching ? <NotesToolBar /> : null}
      </PageHeader>
      <PageMenu>
        {areNotes && !isFetching ? (
          <NotesMenu
            activeItem={activeTab}
            notesCount={notes?.length}
            onChange={(value) => setActiveTab(value)}
          />
        ) : null}
      </PageMenu>
      <PageBody>
        {isFetching ? (
          <Center marginTop="150px">
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : null}
        {!areNotes ? (
          <NotesEmptyState/>
        ) : null}
        {areNotes && !isFetching ? (
          <Grid
            templateColumns="repeat(auto-fill, 282px)"
            gap="16px"
            width="100%"
            marginBottom="32px"
          >
            {NOTES_MOCK.map((mock, idx) => (
              <MessageCard {...mock} key={idx} />
            ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apuntes
