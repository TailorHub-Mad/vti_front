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
import { remove } from "lodash"
import useUserApi from "../../hooks/api/useUserApi"

const project = () => {
  const router = useRouter()
  const { isLoggedIn, user } = useContext(ApiAuthContext)
  const { deleteProject } = useProjectApi()
  const { showToast } = useContext(ToastContext)
  const { updateUser } = useUserApi()

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openFinishModal, setOpenFinishModal] = useState(false)

  const { data, error, mutate, isLoading, isValidating } = projectFetchHandler(
    fetchType.ID,
    {
      [fetchOption.ID]: router.query.alias
    }
  )

  const notFound = !isValidating && !data
  const projectData = data && !checkDataIsEmpty(data) ? data[0].projects[0] : null

  const checkIsFavorite = () => user?.favorites?.projects?.includes(projectData?._id)
  const checkIsSubscribe = () =>
    user?.subscribed?.projects?.includes(projectData?._id)

  const handleOnDelete = async () => {
    try {
      await deleteProject(projectData._id)
      showToast({ message: "Proyecto borrado correctamente" })
      router.push(PATHS.projects)
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleSubscribe = async (state) => {
    const { subscribed, _id } = user

    const listToUpdate = subscribed["projects"]

    if (state) {
      remove(listToUpdate, (e) => e === projectData?._id)
    } else {
      listToUpdate.push(projectData?._id)
    }

    subscribed["projects"] = listToUpdate

    const formatUser = formatUpdateUsersSubscribe(user, subscribed)
    await updateUser(_id, formatUser)
    await mutate()
  }

  const formatUpdateUsersSubscribe = (user, subscribed) => {
    return {
      alias: user.alias,
      name: user.name,
      subscribed,
      department: user.department
    }
  }

  const formatUpdateUsersFavorites = (user, favorites) => {
    return {
      alias: user.alias,
      name: user.name,
      favorites,
      department: user.department
    }
  }

  const handleFavorite = async (state) => {
    const { favorites, _id } = user

    const listToUpdate = favorites["projects"]

    if (state) {
      remove(listToUpdate, (e) => e === projectData?._id)
    } else {
      listToUpdate.push(projectData?._id)
    }

    favorites["projects"] = listToUpdate
    const formatUser = formatUpdateUsersFavorites(user, favorites)
    await updateUser(_id, formatUser)
    await mutate()
  }

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
    <Page>
      {notFound && <>Error. No se ha encontrado el sector.</>}
      {isLoading ? (
        <LoadingView mt="-200px" />
      ) : projectData ? (
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
            projectDetail={true}
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
              onSubscribe={handleSubscribe}
              onFavorite={handleFavorite}
              isSubscribe={checkIsSubscribe()}
              isFavorite={checkIsFavorite()}
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
              closeInfo={projectData?.closed}
              projectId={projectData?._id}
            />
            <ProjectNotes project={projectData} />
          </Box>
        </>
      ) : null}
    </Page>
  )
}

export default project
