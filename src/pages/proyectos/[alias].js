import { Page } from "../../components/layout/Pages/Page"
import { ProjectInfoBar } from "../../views/notes/Project/ProjectInfoBar/ProjectInfoBar"
import { useContext, useState } from "react"
import { NoteDrawer } from "../../components/drawer/NoteDrawer/NoteDrawer"
import { ProjectDetails } from "../../views/notes/Project/ProjectDetails/ProjectDetails"
import { ProjectNotes } from "../../views/notes/Project/ProjectNotes/ProjectNotes"
import { ProjectHeader } from "../../views/notes/Project/ProjectHeader/ProjectHeader"
import { Box } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { projectFetchHandler } from "../../swr/project.swr"
import { fetchOption, fetchType } from "../../utils/constants/global"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { checkDataIsEmpty } from "../../utils/functions/global"

const project = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const [showNoteDetails, setShowNoteDetails] = useState(false)

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchType.ID,
    {
      [fetchOption.ID]: router.query.alias
    }
  )

  const notFound = !isValidating && !data
  const projectData = data && !checkDataIsEmpty(data) ? data[0].projects[0] : null

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !projectData ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el sector.</>}
      {projectData && (
        <>
          <Box
            width={showNoteDetails ? `calc(100% - 536.5px)` : "100%"}
            transition="width 0.3s ease-in-out"
          >
            <ProjectHeader idProject={projectData.ref} />
            <ProjectInfoBar
              projectInfo={[
                projectData?.alias,
                projectData?.clientAlias,
                projectData?.sector[0].title,
                projectData?.date?.year
              ]}
              updatedAt={new Date(projectData?.updatedAt)}
            />
            <ProjectDetails
              focusPoint={projectData?.focusPoint?.map((fp) => fp.alias).join(", ")}
              testSystems={projectData?.testSystems}
              tags={projectData?.tags}
              users={projectData?.users}
            />
            <ProjectNotes
              notes={projectData?.notes}
              showNoteDetails={(idx) => setShowNoteDetails(idx)}
            />
          </Box>
          <NoteDrawer
            isOpen={showNoteDetails}
            onClose={() => setShowNoteDetails(false)}
          />
        </>
      )}
    </Page>
  )
}

export default project
