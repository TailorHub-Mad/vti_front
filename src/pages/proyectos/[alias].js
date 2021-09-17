import { Page } from "../../components/layout/Pages/Page"
import { ProjectInfoBar } from "../../views/notes/Project/ProjectInfoBar/ProjectInfoBar"
import faker from "faker"
import { useContext, useState } from "react"
import { NoteDrawer } from "../../components/drawer/NoteDrawer/NoteDrawer"
import { ProjectDetails } from "../../views/notes/Project/ProjectDetails/ProjectDetails"
import { ProjectNotes } from "../../views/notes/Project/ProjectNotes/ProjectNotes"
import { ProjectHeader } from "../../views/notes/Project/ProjectHeader/ProjectHeader"
import { Spinner, Box } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { projectFetchHandler } from "../../swr/project.swr"
import { fetchOption, fetchType } from "../../utils/constants/global_config"
faker.locale = "es"

const project = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)

  const [showNoteDetails, setShowNoteDetails] = useState(false)

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchType.ID,
    {
      [fetchOption.ID]: router.query.id,
    }
  )

  const notFound = !isValidating && !data

  if (error) return <>ERROR...</>
  if (!isLoggedIn) return <>Loading...</>
  return (
    <Page>
      {isLoading || !data ? <Spinner /> : null}
      {notFound && <>Error. No se ha encontrado el sector.</>}
      {data && (
        <>
          <Box
            width={showNoteDetails ? `calc(100% - 536.5px)` : "100%"}
            transition="width 0.3s ease-in-out"
          >
            <ProjectHeader />
            <ProjectInfoBar
              projectInfo={[
                data?.alias,
                data?.clientAlias,
                data?.sector[0].title,
                data?.date?.year,
              ]}
              updatedAt={new Date(data?.updatedAt)}
            />
            <ProjectDetails
              focusPoint={data?.focusPoint?.map((fp) => fp.alias).join(", ")}
              testSystems={data?.testSystems}
              tags={data?.tags}
              users={data?.users}
            />
            <ProjectNotes showNoteDetails={(idx) => setShowNoteDetails(idx)} />
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
