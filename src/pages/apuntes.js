import { Grid } from "@chakra-ui/react"
import React, { useState } from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { NoteDrawer } from "../components/drawer/NoteDrawer/NoteDrawer"
import { Page } from "../components/layout/Pages/Page"
import { PageBody } from "../components/layout/Pages/PageBody/PageBody"
import { PageHeader } from "../components/layout/Pages/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/Pages/PageMenu/PageMenu"
import { ToolBar } from "../components/navigation/ToolBar/ToolBar"
import { Spinner } from "../components/spinner/Spinner"
import { NOTES_MOCK } from "../mock/notes"
import { NotesEmptyState } from "../views/notes/NotesEmptyState/NotesEmptyState"
import { NotesMenu } from "../views/notes/NotesMenu/NotesMenu"

const apuntes = () => {
  // TODO fetch notes
  // const notes = null
  const isFetching = false
  const notes = new Array(150).fill("")
  const areNotes = notes && notes.length > 0
  const [activeTab, setActiveTab] = useState("all")
  const [showNoteDetails, setShowNoteDetails] = useState(null)
  return (
    <Page>
      <NoteDrawer
        isOpen={showNoteDetails}
        onClose={() => setShowNoteDetails(null)}
      />
      <PageHeader title="Apuntes">
        {areNotes && !isFetching ? <ToolBar /> : null}
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
      <PageBody height="calc(100vh - 140px)">
        {isFetching ? <Spinner /> : null}
        {!areNotes ? <NotesEmptyState /> : null}
        {areNotes && !isFetching ? (
          <Grid
            templateColumns="repeat(auto-fill, 282px)"
            gap="16px"
            width="100%"
            marginBottom="32px"
          >
            {NOTES_MOCK.map((mock, idx) => (
              <MessageCard
                {...mock}
                key={idx}
                onSeeDetails={() => setShowNoteDetails(idx.toString())}
              />
            ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apuntes
