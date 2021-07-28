import { Page } from "../../components/layout/Page/Page"
import { ProjectInfoBar } from "../../views/notes/Project/ProjectInfoBar/ProjectInfoBar"
import faker from "faker"
import { useState } from "react"
import { NoteDrawer } from "../../components/drawer/NoteDrawer/NoteDrawer"
import { ProjectDetails } from "../../views/notes/Project/ProjectDetails/ProjectDetails"
import { ProjectNotes } from "../../views/notes/Project/ProjectNotes/ProjectNotes"
import { ProjectHeader } from "../../views/notes/Project/ProjectHeader/ProjectHeader"
faker.locale = "es"
const { Center, Spinner, Box } = require("@chakra-ui/react")

const project = () => {
  //TODO Getstaticsprops con el fetch al proyecto
  const isFetching = false
  const [showNoteDetails, setShowNoteDetails] = useState(false)
  const detailBoxWidth = "536.5px"
  return (
    <Page>
      <Box
        width={showNoteDetails ? `calc(100% - ${detailBoxWidth})` : "100%"}
        transition="width 0.3s ease-in-out"
      >
        <ProjectHeader />
        <ProjectInfoBar
          projectInfo={["PRY001", "Cliente", "Sector", "Año"]}
          updatedAt={faker.date.past()}
        />
        <ProjectDetails />
        <ProjectNotes showNoteDetails={(idx) => setShowNoteDetails(idx)} />
        {isFetching ? (
          <Center marginTop="150px">
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : null}
      </Box>
      <NoteDrawer
        isOpen={showNoteDetails}
        onClose={() => setShowNoteDetails(false)}
      />
    </Page>
  )
}

export default project
