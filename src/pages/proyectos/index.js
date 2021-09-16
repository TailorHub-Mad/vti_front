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
  fetchType,
} from "../../utils/constants/global_config"
import { projectFetchHandler } from "../../swr/project.swr"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddProjectIcon } from "../../components/icons/AddProjectIcon"

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
  const [projectsToDelete, setProjectsToDelete] = useState(null)

  const isGrouped = fetchState === fetchType.GROUPED
  const isEmptyData = Boolean(data && data[0]?.projects.length === 0)
  const projectsData = data ? data[0]?.projects : []

  // TODO
  const handleExport = () => {}

  const handleOpenPopup = (projectsToDelete, type) => {
    setDeleteType(type)
    setProjectsToDelete(projectsToDelete)
  }

  const handleClosePopup = () => {
    setDeleteType(null)
    setProjectsToDelete(null)
  }

  const handleOnCloseModal = () => {
    setProjectToUpdate(null)
    setIsProjectModalOpen(false)
  }

  const getAliasByIdProject = (id) => {
    const { alias } = projectsData.find((project) => project._id === id) || {}
    return alias
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(projectsToDelete, projectsData)
    setDeleteType(null)
    setProjectsToDelete(null)
  }

  const deleteOne = async (id, projects) => {
    await deleteProject(id)
    const updatedProjects = []
    updatedProjects.push({
      projects: projects.filter((project) => project._id !== id),
    })
    await mutate(updatedProjects, false)
    showToast("Proyecto borrado correctamente")
  }

  const deleteMany = async (ids, projects) => {
    const idProjects = Object.keys(ids)
    const projectsQueue = idProjects.map((id) => deleteProject(id))
    await Promise.all(projectsQueue)

    const updatedProjects = []
    updatedProjects.push({
      projects: projects.filter((pr) => !idProjects.includes(pr._id)),
    })
    await mutate(updatedProjects, false)
    showToast("Proyectos borrados correctamente")
  }

  const onEdit = (id) => {
    const project = [...projectsData].find((project) => project._id === id)
    setProjectToUpdate(project)
    setIsProjectModalOpen(true)
  }

  const onSearch = (search) =>
    setFetchOptions({
      [fetchOption.SEARCH]: search,
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
        {deleteType === DeleteType.ONE
          ? `¿Desea eliminar ${getAliasByIdProject(projectsToDelete)}?`
          : "¿Desea eliminar los proyectos seleccionados?"}
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
        {!isLoading && !isEmptyData && (
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
        )}
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
      {data && !isLoading ? (
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
