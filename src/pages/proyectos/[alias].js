import { Page } from "../../components/layout/Pages/Page"
import { ProjectInfoBar } from "../../views/projects/ProjectDetail/ProjectInfoBar/ProjectInfoBar"
import { useContext, useState } from "react"
import { ProjectDetails } from "../../views/projects/ProjectDetail/ProjectDetails/ProjectDetails"
import { ProjectNotes } from "../../views/projects/ProjectDetail/ProjectNotes/ProjectNotes"
import { ProjectHeader } from "../../views/projects/ProjectDetail/ProjectHeader/ProjectHeader"
import { Box } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { projectFetchHandler } from "../../swr/project.swr"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { checkDataIsEmpty } from "../../utils/functions/global"
import { Popup } from "../../components/overlay/Popup/Popup"
import { FinishProjectModal } from "../../views/projects/NewProject/FinishProjectModal/FinishProjectModal"
import useProjectApi from "../../hooks/api/useProjectApi"
import { ToastContext } from "../../provider/ToastProvider"
import { PATHS } from "../../utils/constants/global"
import { NewProjectModal } from "../../views/projects/NewProject/NewProjectModal/NewProjectModal"

const project = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteProject } = useProjectApi()
  const { showToast } = useContext(ToastContext)

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openFinishModal, setOpenFinishModal] = useState(false)

  const { data, error, isLoading, isValidating } = projectFetchHandler(
    fetchType.ID,
    {
      [fetchOption.ID]: router.query.alias
    }
  )

  const notFound = !isValidating && !data
  const projectData = data && !checkDataIsEmpty(data) ? data[0].projects[0] : null

  const handleOnDelete = async () => {
    try {
      await deleteProject(projectData._id)
      showToast("Proyecto borrado correctamente")
      router.push(PATHS.projects)
    } catch (error) {
      errorHandler(error)
    }
  }

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {isLoading || !projectData ? <LoadingView mt="-200px" /> : null}
      {notFound && <>Error. No se ha encontrado el sector.</>}
      {projectData && (
        <>
          <Popup
            variant="twoButtons"
            confirmText="Eliminar"
            cancelText="Cancelar"
            color="error"
            isOpen={openDeleteModal}
            onConfirm={handleOnDelete}
            onClose={() => setOpenDeleteModal(false)}
          >
            {`¿Desea eliminar ${projectData.alias}?`}
          </Popup>

          <NewProjectModal
            projectToUpdate={projectData}
            isOpen={openUpdateModal}
            onClose={() => setOpenUpdateModal(false)}
          />

          <FinishProjectModal
            project={projectData}
            isOpen={openFinishModal}
            onClose={() => setOpenFinishModal(false)}
          />

          <Box width="100%" transition="width 0.3s ease-in-out">
            <ProjectHeader
              idProject={projectData.ref}
              onEdit={() => setOpenUpdateModal(true)}
              onClose={() => setOpenFinishModal(true)}
              onDelete={() => setOpenDeleteModal(true)}
              isClosed={Boolean(projectData.closed)}
            />
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
              notesData={projectData?.notes.filter((n) => n?._id)}
              project={projectData}
            />
          </Box>
        </>
      )}
    </Page>
  )
}

export default project
