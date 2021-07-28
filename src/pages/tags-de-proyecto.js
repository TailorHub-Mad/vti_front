import { Box, Center, Grid, Spinner, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { TagCard } from "../components/cards/TagCard/TagCard"
import { NoteDrawer } from "../components/drawer/NoteDrawer/NoteDrawer"
import { Page } from "../components/layout/Page/Page"
import { PageBody } from "../components/layout/PageBody/PageBody"
import { PageHeader } from "../components/layout/PageHeader/PageHeader"
import { PageMenu } from "../components/layout/PageMenu/PageMenu"
import { LoadingTableSpinner } from "../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import { NOTES_MOCK } from "../mock/notes"
import { PROJECT_TAGS_MOCK } from "../mock/tags"
import { NotesEmptyState } from "../views/notes/NotesEmptyState/NotesEmptyState"
import { NotesMenu } from "../views/notes/NotesMenu/NotesMenu"
import { NotesToolBar } from "../views/notes/NotesToolBar/NotesToolBar"
import { ProjectTagsToolBar } from "../views/projectTags/ProjectTagsToolBar/ProjectTagsToolBar"

const tagsDeProyecto = () => {
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
      <PageHeader title="Tags de Proyecto">
        {areNotes && !isFetching ? <ProjectTagsToolBar /> : null}
      </PageHeader>
      <Box p="32px" bgColor="white" boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)">
        <PageBody height="calc(100vh - 250px)">
          {isFetching ? <LoadingTableSpinner /> : null}
          {!areNotes ? <NotesEmptyState /> : null}
          {areNotes && !isFetching ? (
            <Grid
              templateColumns="repeat(auto-fill, 266px)"
              gap="16px"
              width="100%"
              marginBottom="32px"
            >
              {PROJECT_TAGS_MOCK.map((tag) => (
                <TagCard key={tag.name} {...tag} />
              ))}
            </Grid>
          ) : null}
        </PageBody>
      </Box>
    </Page>
  )
}

export default tagsDeProyecto
