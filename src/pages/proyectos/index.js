import { useContext, useState } from "react"
import useProjectApi from "../../hooks/api/useProjectApi"
import { ProjectsTable } from "../../views/projects/ProjectTable/ProjectTable"
import { Popup } from "../../components/overlay/Popup/Popup"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { NewProjectModal } from "../../views/projects/NewProject/NewProjectModal/NewProjectModal"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Spinner } from "../../components/spinner/Spinner"
import { ToastContext } from "../../provider/ToastProvider"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import {
  DeleteType,
  fetchOption,
  fetchType
} from "../../utils/constants/global_config"
import { projectFetchHandler } from "../../swr/project.swr"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddProjectIcon } from "../../components/icons/AddProjectIcon"
import { checkDataIsEmpty, getFieldObjectById } from "../../utils/functions/common"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"

const proyectos = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteProject } = useProjectApi()
  const { showToast } = useContext(ToastContext)

  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})
  const { data, error, isLoading, mutate } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToUpdate, setProjectToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [projectToDelete, setProjectsToDelete] = useState(null)

  const isGrouped = fetchState === fetchType.GROUPED
  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = data ? data[0]?.projects : []

  // TODO
  const handleExport = () => {}

  const handleOpenPopup = (projectToDelete, type) => {
    setDeleteType(type)
    setProjectsToDelete(projectToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setProjectsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setProjectToUpdate(null)
    setIsProjectModalOpen(false)
  }

  const handleDeleteMessage = () => {
    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los sectores seleccionados?"
    const label = getFieldObjectById(projectsData, "alias", projectToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(projectToDelete, projectsData)
    updated.length > 0
      ? await mutate(updated, false)
      : await mutate(SWR_CACHE_KEYS.projects)
    setDeleteType(null)
    setProjectsToDelete(null)
  }

  const deleteOne = async (id, projects) => {
    try {
      await deleteProject(id)
      showToast("Proyecto borrado correctamente")
      const updatedProjects = []
      const filteredProjects = projects.filter((system) => system._id !== id)
      updatedProjects.push({
        testProjects: filteredProjects
      })
      return updatedProjects
    } catch (error) {
      // TODO -> manage erros
      console.log("ERROR")
    }
  }

  const deleteMany = async (projectsId, projects) => {
    try {
      const projectsQueue = projectsId.map((id) => deleteProject(id))
      await Promise.all(projectsQueue)
      showToast("Clientes borrados correctamente")
      const updatedProjects = []
      const filteredProjects = projects.filter(
        (project) => !projectsId.includes(project._id)
      )
      updatedProjects.push({ project: filteredProjects })
      return filteredProjects
    } catch (error) {
      // TODO -> manage erros
      console.log("ERROR")
    }
  }

  const onEdit = (id) => {
    const project = projectsData.find((project) => project._id === id)
    setProjectToUpdate(project)
    setIsProjectModalOpen(true)
  }

  const onSearch = (search) =>
    setFetchOptions({
      [fetchOption.SEARCH]: search
    })

  const handleOnGroup = () => {
    setFetchState(fetchType.GROUPED)
  }

  const handleOnFilter = () => {
    setFetchState(fetchType.FILTERED)
  }

  if (error) return <>ERROR...</>
  return !isLoggedIn ? (
    <>Loading...</>
  ) : (
    <Page>
      <Popup
        variant="twoButtons"
        confirmText="Eliminar"
        cancelText="Cancelar"
        color="error"
        isOpen={deleteType}
        onConfirm={handleDeleteFunction}
        onClose={handleClosePopup}
      >
        {handleDeleteMessage()}
      </Popup>

      <NewProjectModal
        projectToUpdate={projectToUpdate}
        isOpen={isProjectModalOpen}
        onClose={handleOnCloseModal}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader>
        <BreadCrumbs />
        {projectsData ? (
          <ToolBar
            onAdd={() => setIsProjectModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={handleOnFilter}
            onImport={() => setShowImportModal(true)}
            onExport={handleExport}
            addLabel="Añadir proyecto"
            searchPlaceholder="Busqueda por ID, Alias"
            icon={<AddProjectIcon />}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <Spinner /> : null}
      {isEmptyData ? (
        <ViewEmptyState
          message="Añadir proyectos a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir proyecto"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsProjectModalOpen(true)}
        />
      ) : null}
      {projectsData ? (
        <ProjectsTable
          isGrouped={isGrouped}
          items={projectsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
          onTabChange={(state) => setFetchState(state)}
        />
      ) : null}
    </Page>
  )
}

export default proyectos
