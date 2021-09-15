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
import useProjectApi from "../../hooks/api/useProjectApi"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import useFetchSWR from "../../hooks/useFetchSWR"
faker.locale = "es"

const project = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { getProject } = useProjectApi()

  const { data, error, isLoading, isValidating } = useFetchSWR(
    [SWR_CACHE_KEYS.project, router.query.id],
    getProject
  )

  const [showNoteDetails, setShowNoteDetails] = useState(false)
  const detailBoxWidth = "536.5px"

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
            width={showNoteDetails ? `calc(100% - ${detailBoxWidth})` : "100%"}
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
