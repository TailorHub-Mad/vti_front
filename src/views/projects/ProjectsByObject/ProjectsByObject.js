import download from "downloadjs"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { jsonToCSV } from "react-papaparse"
import { useSWRConfig } from "swr"
import { AddProjectIcon } from "../../../components/icons/AddProjectIcon"
import { PageHeader } from "../../../components/layout/Pages/PageHeader/PageHeader"
import { BreadCrumbs } from "../../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../../components/navigation/ToolBar/ToolBar"
import { ExportFilesModal } from "../../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import { ImportFilesModal } from "../../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { Popup } from "../../../components/overlay/Popup/Popup"
import useProjectApi from "../../../hooks/api/useProjectApi"
import { ToastContext } from "../../../provider/ToastProvider"
import { DeleteType } from "../../../utils/constants/global"
import { fetchOption, fetchType } from "../../../utils/constants/swr"
import { SWR_CACHE_KEYS } from "../../../utils/constants/swr"
import { errorHandler } from "../../../utils/errors"
import { getFieldObjectById } from "../../../utils/functions/global"
import {
  projectDataTransform,
  transformProjectsToExport
} from "../../../utils/functions/import_export/projects_helper"
import { getGroupOptionLabel } from "../../../utils/functions/objects"
import { ViewNotFoundState } from "../../common/ViewNotFoundState"
import { FinishProjectModal } from "../NewProject/FinishProjectModal/FinishProjectModal"
import { NewProjectModal } from "../NewProject/NewProjectModal/NewProjectModal"
import { ProjectsTable } from "../ProjectTable/ProjectTable"

const PROJECTS_GROUP_OPTIONS = [
  {
    label: "Cliente",
    value: "client"
  },
  {
    label: "Año",
    value: "date.year"
  },
  {
    label: "Sector",
    value: "sector.0.title"
  }
]

export const ProjectsByObject = ({
  projects: projectsData,
  customURL,
  fetchState,
  setFetchState,
  fetchOptions,
  setFetchOptions,
  isEmptyData,
  hrefBack,
  backText
}) => {
  // Hooks
  const { deleteProject, createProject } = useProjectApi()
  const { showToast } = useContext(ToastContext)
  const { mutate } = useSWRConfig()

  const router = useRouter()

  // States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToUpdate, setProjectToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [projectToDelete, setProjectsToDelete] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [projectToFinish, setProjectToFinish] = useState(null)
  const [isFinishProjectModalOpen, setIsFinishProjectModalOpen] = useState(null)

  const isSearch = fetchState == fetchType.SEARCH

  // Handlers views
  const isToolbarHidden = () => {
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleImportProjects = async (data) => {
    try {
      for (let index = 0; index < data.length; index++) {
        await createProject(data[index])
      }

      await mutate()

      setShowImportModal(false)
      showToast({ message: "Proyectos importados correctamente" })
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportProjects = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformProjectsToExport(projectsData))
    download(_data, `projects_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

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

  const handleOnOpenFinishProjectModal = (id) => {
    const project = projectsData.find((p) => (p._id = id))
    setProjectToFinish(project)
    setIsFinishProjectModalOpen(true)
  }

  const handleOnCloseFinishProjectModal = () => {
    setProjectToFinish(null)
    setIsFinishProjectModalOpen(null)
  }

  // Handle CRUD
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
      showToast({ message: "Proyecto borrado correctamente" })
      const updatedProjects = []
      const filterProjects = projects.filter((system) => system._id !== id)
      updatedProjects.push({
        projects: filterProjects
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
      showToast({ message: "Proyectos borrados correctamente" })
      const updatedProjects = []
      const filterProjects = projects.filter(
        (project) => !projectsId.includes(project._id)
      )
      updatedProjects.push({ projects: filterProjects })
      return filterProjects
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleUpdate = (id) => {
    const project = projectsData.find((project) => project._id === id)
    setProjectToUpdate(project)
    setIsProjectModalOpen(true)
  }

  // Filters
  const onSearch = (search) => {
    if (!search) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.SEARCH]: null
      })
      return
    }

    setFetchState(fetchType.SEARCH)
    setFetchOptions({
      [fetchOption.SEARCH]: search
    })
  }

  const handleOnGroup = (group) => {
    if (!group) {
      setFetchState(fetchType.ALL)
      setFetchOptions({
        [fetchOption.GROUP]: null
      })
      return
    }

    setFetchState(fetchType.GROUP)
    setFetchOptions({
      [fetchOption.GROUP]: group
    })
  }

  const handleOnFilter = (filter) => {
    setFetchState(fetchType.FILTER)
    setFetchOptions({
      [fetchOption.FILTER]: filter
    })
  }

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

      <FinishProjectModal
        project={projectToFinish}
        isOpen={isFinishProjectModalOpen}
        onClose={handleOnCloseFinishProjectModal}
      />

      <NewProjectModal
        projectToUpdate={projectToUpdate}
        isOpen={isProjectModalOpen}
        onClose={handleOnCloseModal}
      />

      <ExportFilesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={() => handleExportProjects()}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={(data) => handleImportProjects(data)}
        onDropDataTransform={(info) => projectDataTransform(info)}
      />

      <PageHeader>
        {projectsData ? (
          <BreadCrumbs customURL={customURL} lastElement={"Proyectos"} />
        ) : null}
        {isToolbarHidden() ? (
          <ToolBar
            onAdd={() => setIsProjectModalOpen(true)}
            onSearch={onSearch}
            onGroup={handleOnGroup}
            onFilter={handleOnFilter}
            onImport={() => setShowImportModal(true)}
            onExport={() => setShowExportModal(true)}
            addLabel="Añadir proyecto"
            searchPlaceholder="Busqueda por ID, Alias"
            groupOptions={PROJECTS_GROUP_OPTIONS}
            icon={<AddProjectIcon />}
            // fetchState={fetchState} -> Provisional to filters
            noImport
          />
        ) : null}
      </PageHeader>
      {isEmptyData ? (
        <ViewNotFoundState
          text="No hay proyectos asociados"
          backText={backText}
          onClick={() => router.push(hrefBack)}
        />
      ) : (
        <ProjectsTable
          // fetchState={fetchState} -> Provisional to filters
          projects={projectsData}
          onClose={handleOnOpenFinishProjectModal}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={handleUpdate}
          onTabChange={(state) => setFetchState(state)}
          onGroup={handleOnGroup}
          groupOption={getGroupOptionLabel(
            PROJECTS_GROUP_OPTIONS,
            fetchOptions[fetchOption.GROUP]
          )}
        />
      )}
    </>
  )
}
