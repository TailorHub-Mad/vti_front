import { useContext, useState } from "react"
import useProjectApi from "../../hooks/api/useProjectApi"
import { ProjectsTable } from "../../views/projects/ProjectTable/ProjectTable"
import { Popup } from "../../components/overlay/Popup/Popup"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { NewProjectModal } from "../../views/projects/NewProject/NewProjectModal/NewProjectModal"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { ToastContext } from "../../provider/ToastProvider"
import { ImportFilesModal } from "../../components/overlay/Modal/ImportFilesModal/ImportFilesModal"
import { fetchOption, fetchType } from "../../utils/constants/swr"
import { DeleteType } from "../../utils/constants/global"
import { projectFetchHandler } from "../../swr/project.swr"
import { ViewEmptyState } from "../../views/common/ViewEmptyState"
import { BreadCrumbs } from "../../components/navigation/BreadCrumbs/BreadCrumbs"
import { ToolBar } from "../../components/navigation/ToolBar/ToolBar"
import { AddProjectIcon } from "../../components/icons/AddProjectIcon"
import {
  checkDataIsEmpty,
  getFieldGRoupObjectById,
  getFieldObjectById
} from "../../utils/functions/global"
import { LoadingView } from "../../views/common/LoadingView"
import { errorHandler } from "../../utils/errors"
import { getGroupOptionLabel } from "../../utils/functions/objects"
import download from "downloadjs"
import { jsonToCSV } from "react-papaparse"

import { ExportFilesModal } from "../../components/overlay/Modal/ExportFilesModal/ExportFilesModal"
import {
  projectDataTransform,
  transformProjectsToExport
} from "../../utils/functions/import_export/projects_helper"
import { ViewNotFoundState } from "../../views/common/ViewNotFoundState"
import { FinishProjectModal } from "../../views/projects/NewProject/FinishProjectModal/FinishProjectModal"

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

const proyectos = () => {
  // Hooks
  const { isLoggedIn } = useContext(ApiAuthContext)
  const { deleteProject, createProject } = useProjectApi()
  const { showToast } = useContext(ToastContext)

  // States
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToUpdate, setProjectToUpdate] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [projectsToDelete, setProjectsToDelete] = useState(null)
  const [projectToFinish, setProjectToFinish] = useState(null)
  const [isFinishProjectModalOpen, setIsFinishProjectModalOpen] = useState(null)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const [fetchOptions, setFetchOptions] = useState({})

  // Fetch
  const { data, error, isLoading, mutate } = projectFetchHandler(
    fetchState,
    fetchOptions
  )

  const handleProjectsData = (isEmptyData) => {
    if (!data || isEmptyData) return null
    if (fetchState == fetchType.GROUP) return data
    return data[0].projects

    // TODO FILTER
  }

  const isEmptyData = checkDataIsEmpty(data)
  const projectsData = handleProjectsData(isEmptyData)

  const isSearch = fetchState == fetchType.SEARCH
  const isGrouped = fetchState == fetchType.GROUP

  // Handlers views
  const isToolbarHidden = () => {
    if (isLoading) return false
    if (isEmptyData && !isSearch) return false

    return true
  }

  const handleImportProjects = async (data) => {
    //TODO Gestión de errores y update de SWR

    try {
      const projectsCreated = []
      for (let index = 0; index < data.length; index++) {
        const pro = await createProject(data[index])
        projectsCreated.push(pro)
      }

      await mutate()

      setShowImportModal(false)
      showToast("Proyectos importados correctamente")
    } catch (error) {
      errorHandler(error)
    }
  }

  const handleExportProjects = () => {
    setShowExportModal(false)
    const _data = jsonToCSV(transformProjectsToExport(projectsData))
    download(_data, `projects_export_${new Date().toLocaleDateString()}`, "text/csv")
  }

  // Handlers views
  const handleOpenPopup = (projectsToDelete, type) => {
    setDeleteType(type)

    if (type === DeleteType.ONE && isGrouped) {
      const [id, { key }] = Object.entries(projectsToDelete)[0]
      return setProjectsToDelete({ id, key })
    }
    return setProjectsToDelete(projectsToDelete)
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

  // Handlers CRUD
  const handleDeleteMessage = () => {
    if (!projectsToDelete) return

    if (deleteType === DeleteType.MANY)
      return "¿Desea eliminar los proyectos seleccionados?"

    const label = isGrouped
      ? getFieldGRoupObjectById(
          projectsData,
          "alias",
          projectsToDelete.id,
          projectsToDelete.key
        )
      : getFieldObjectById(projectsData, "alias", projectsToDelete)
    return `¿Desea eliminar ${label}?`
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    const updated = await f(projectsToDelete, projectsData)

    setDeleteType(null)
    setProjectsToDelete(null)
    if (isGrouped || updated?.length === 0) return await mutate()
    await mutate(updated, false)
  }

  const deleteOne = async (data, projects) => {
    try {
      if (isGrouped) {
        await deleteProject(data.id)
        showToast("Proyecto borrado correctamente")
        return
      }

      await deleteProject(data)
      showToast("Proyecto borrado correctamente")
      const updatedProjects = []
      const filterProjects = projects.filter((system) => system._id !== data)
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
      showToast("Proyectos borrados correctamente")
      const updatedProjects = []
      const filterProjects = projects.filter(
        (project) => !projectsId.includes(project._id)
      )
      updatedProjects.push({ projects: filterProjects })
      return updatedProjects
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

  if (!isLoggedIn) return null
  if (error) return errorHandler(error)
  return (
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

      <FinishProjectModal
        project={projectToFinish}
        isOpen={isFinishProjectModalOpen}
        onClose={handleOnCloseFinishProjectModal}
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
        <BreadCrumbs />
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
            fetchState={fetchState}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingView mt="-200px" /> : null}
      {isEmptyData && isSearch ? (
        <ViewNotFoundState />
      ) : isEmptyData ? (
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
          fetchState={fetchState}
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
      ) : null}
    </Page>
  )
}

export default proyectos
