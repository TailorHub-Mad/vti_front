import { Button, Center, Grid, Spinner, Text } from "@chakra-ui/react"
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

const apuntes = () => {
  //fetch notes

  // const notes = null
  const isFetching = false
  const notes = new Array(50).fill("")
  const areNotes = notes && notes.length > 0
  return (
    <Page>
      <PageHeader title="Apuntes">
        {areNotes && !isFetching ? <NotesToolBar /> : null}
      </PageHeader>
      <PageMenu>
        {areNotes && !isFetching ? <NotesMenu notesCount={notes?.length} /> : null}
      </PageMenu>
      <PageBody>
        {isFetching ? (
          <Center marginTop="150px">
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : null}
        {!areNotes ? (
          <Center flexDir="column" marginTop="150px">
            <Text variant="d_s_medium" marginBottom="24px">
              Añade apuntes a la plataforma
            </Text>
            <Button
              display="flex"
              justifyContent="flex-start"
              leftIcon={<UploadCloudIcon />}
              variant="secondary"
              marginBottom="16px"
            >
              Importar
            </Button>
            <Button
              display="flex"
              justifyContent="flex-start"
              leftIcon={<AddNoteIcon />}
            >
              Añadir apunte
            </Button>
          </Center>
        ) : null}
        {areNotes && !isFetching ? (
          <Grid
            templateColumns="repeat(auto-fill, 282px)"
            gap="16px"
            width="100%"
            marginBottom="32px"
          >
            {notes.map((mock) => (
              <MessageCard />
            ))}
          </Grid>
        ) : null}
      </PageBody>
    </Page>
  )
}

export default apuntes
