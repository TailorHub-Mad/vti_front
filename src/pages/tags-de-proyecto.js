import { Box, Center, Flex, Grid, Spinner, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { MessageCard } from "../components/cards/MessageCard/MessageCard"
import { TagCard } from "../components/cards/TagCard/TagCard"
import { NoteDrawer } from "../components/drawer/NoteDrawer/NoteDrawer"
import { ListIcon } from "../components/icons/ListIcon"
import { TagLinkIcon } from "../components/icons/TagLinkIcon"
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
import { ProjectsTagsHeader } from "../views/projectTags/ProjectTagsHeader/ProjectTagsHeader"
import { ProjectTagsToolBar } from "../views/projectTags/ProjectTagsToolBar/ProjectTagsToolBar"

const tagsDeProyecto = () => {
  // TODO fetch notes
  // const notes = null
  const isFetching = false
  const notes = new Array(150).fill("")
  const areNotes = notes && notes.length > 0
  const [activeTab, setActiveTab] = useState("inheritance")
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
      {isFetching ? <LoadingTableSpinner /> : null}
      {!areNotes ? <NotesEmptyState /> : null}
      <PageBody
        p="32px"
        bgColor="white"
        boxShadow="0px 0px 8px rgba(5, 46, 87, 0.1)"
      >
        <ProjectsTagsHeader
          activeItem={activeTab}
          onChange={(value) => setActiveTab(value)}
          tagsCount={PROJECT_TAGS_MOCK.length}
        />
        {areNotes && !isFetching && activeTab === "inheritance" ? (
          <>
            <Text variant="d_s_medium">Primer Grado</Text>
            <Grid
              templateColumns="repeat(auto-fill, 266px)"
              gap="16px"
              width="100%"
              mt="8px"
              mb="24px"
            >
              {PROJECT_TAGS_MOCK.filter((tag) => tag.parentTag).map((tag) => (
                <TagCard key={tag.name} {...tag} />
              ))}
            </Grid>
            <Text variant="d_s_medium">Grado Cero</Text>
            <Grid
              templateColumns="repeat(auto-fill, 266px)"
              gap="16px"
              width="100%"
              mt="8px"
              mb="24px"
            >
              {PROJECT_TAGS_MOCK.filter((tag) => !tag.parentTag).map((tag) => (
                <TagCard key={tag.name} {...tag} />
              ))}
            </Grid>
          </>
        ) : null}
        {areNotes && !isFetching && activeTab === "alphabetic" ? (
          <Grid
            templateColumns="repeat(auto-fill, 266px)"
            gap="16px"
            width="100%"
            mt="8px"
            mb="24px"
          >
            {[...PROJECT_TAGS_MOCK].sort((a, b) => a.name.localeCompare(b.name)).map((tag) => (
              <TagCard key={tag.name} {...tag} />
            ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default tagsDeProyecto
