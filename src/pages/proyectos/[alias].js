import { Page } from "../../components/layout/Pages/Page"
import { ProjectInfoBar } from "../../views/notes/Project/ProjectInfoBar/ProjectInfoBar"
import faker from "faker"
import { useEffect, useState } from "react"
import { NoteDrawer } from "../../components/drawer/NoteDrawer/NoteDrawer"
import { ProjectDetails } from "../../views/notes/Project/ProjectDetails/ProjectDetails"
import { ProjectNotes } from "../../views/notes/Project/ProjectNotes/ProjectNotes"
import { ProjectHeader } from "../../views/notes/Project/ProjectHeader/ProjectHeader"
import { Center, Spinner, Box } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { useSWRConfig } from "swr"
import useProjectApi from "../../hooks/api/useProjectApi"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
faker.locale = "es"

const project = () => {
  const isFetching = false
  const [showNoteDetails, setShowNoteDetails] = useState(false)
  const detailBoxWidth = "536.5px"
  const router = useRouter()
  const { cache } = useSWRConfig()
  const { getProject: project } = useProjectApi()

  const [projectData, setProjectData] = useState(null)
  const [projectNotFound, setProjectNotFound] = useState(false)
  console.log("PROYECTO", projectData)
  const findProjectInCache = (projects, id) => {
    const project = projects.find((project) => project.id === id)
    if (project) return setProjectData(project)
    getProject()
  }

  const getProject = async () => {
    const data = await project(router.query.alias)
    data.length === 0
      ? setProjectNotFound(true)
      : setProjectData(data[0]?.projects[0])
    console.log(projectNotFound)
  }

  useEffect(() => {
    if (!cache.has(SWR_CACHE_KEYS.projects)) return getProject()
    findProjectInCache(cache.get(SWR_CACHE_KEYS.projects), router.query.alias)
  }, [cache])
  console.log(projectData?.focusPoint?.alias)
  return projectData?.alias ? (
    <Page>
      <Box
        width={showNoteDetails ? `calc(100% - ${detailBoxWidth})` : "100%"}
        transition="width 0.3s ease-in-out"
      >
        <ProjectHeader />
        <ProjectInfoBar
          projectInfo={[
            projectData?.alias,
            projectData?.clientAlias,
            projectData?.sector[0].title,
            projectData?.date?.year,
          ]}
          updatedAt={new Date(projectData?.updatedAt)}
        />
        <ProjectDetails
          focusPoint={projectData?.focusPoint?.map((fp) => fp.alias).join(", ")}
          testSystems={projectData?.testSystems}
          tags={projectData?.tags}
          users={projectData?.users}
        />
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
  ) : (
    "Cargando..."
  )
}

export default project
