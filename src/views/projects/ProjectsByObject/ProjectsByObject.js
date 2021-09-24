import { useContext, useState } from "react"
import { useSWRConfig } from "swr"
import { AddProjectIcon } from "../../../components/icons/AddProjectIcon"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import { ImportFilesModal } from "../../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../../components/overlay/Popup/Popup"
import useProjectApi from "../../../hooks/api/useProjectApi"
import { ToastContext } from "../../../provider/ToastProvider"
import {
  DeleteType,
  fetchOption,
  fetchType
} from "../../../utils/constants/global_config"
import { SWR_CACHE_KEYS } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import { getFieldObjectById } from "../../../utils/functions/common"
import { ViewEmptyState } from "../../common/ViewEmptyState"
import { NewProjectModal } from "../NewProject/NewProjectModal/NewProjectModal"
import { ProjectsTable } from "../ProjectTable/ProjectTable"

export const ProjectsByObject = ({ projects: projectsData, customURL }) => {
  const { deleteProject } = useProjectApi()
  const { showToast } = useContext(ToastContext)

  const { mutate } = useSWRConfig()
  // TODO review
  const [, setFetchState] = useState(fetchType.ALL)
  const [, setFetchOptions] = useState({})

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToUpdate, setProjectToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [projectToDelete, setProjectsToDelete] = useState(null)

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
    if (!projectToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los proyectos seleccionados?"
    const label = getFieldObjectById(projectsData, "alias", projectToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(projectToDelete, projectsData)
    updated.length > 0
      ? await mutate(SWR_CACHE_KEYS.projects, updated, false)
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
        projects: filteredProjects
      })
      return updatedProjects
    } catch (error) {
      errorHandler(error)
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
      updatedProjects.push({ projects: filteredProjects })
      return filteredProjects
    } catch (error) {
      errorHandler(error)
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
    setFetchState(fetchType.GROUP)
  }

  const handleOnFilter = () => {
    setFetchState(fetchType.FILTERED)
  }

  const isEmptyData = projectsData.length === 0

  return (
    <>
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
        <BreadCrumbs customURL={customURL} lastElement="Proyectos" />
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
      {isEmptyData ? (
        <ViewEmptyState
          message="Añadir proyectos a la plataforma"
          importButtonText="Importar"
          addButtonText="Añadir proyecto"
          onImport={() => setShowImportModal(true)}
          onAdd={() => setIsProjectModalOpen(true)}
        />
      ) : (
        <ProjectsTable
          projects={projectsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
          onTabChange={(state) => setFetchState(state)}
        />
      )}
    </>
  )
}
