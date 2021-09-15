import { useContext, useEffect, useState } from "react"
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
import { DeleteType, fetchType } from "../../utils/constants/global_config"
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
  const { data, error, isLoading, mutate } = projectFetchHandler(fetchState)

  const [activeTab, setActiveTab] = useState("all")
  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToUpdate, setProjectToUpdate] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [projectsToDelete, setProjectsToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [searchedProjects, setSearchedProjects] = useState([])

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

  const handleOnOpenModal = () => {
    setIsProjectModalOpen(true)
  }

  const handleOnCloseModal = () => {
    setProjectToUpdate(null)
    setIsProjectModalOpen(false)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(projectsToDelete, projectsData)
    setDeleteType(null)
    setProjectsToDelete(null)
  }

  const getAliasByIdProject = (id) => {
    const { alias } = projectsData.find((project) => project._id === id) || {}
    return alias
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
    const projectsQueue = ids.map((id) => deleteProject(id))
    await Promise.all(projectsQueue)

    const updatedProjects = []
    updatedProjects.push({
      projects: projects.filter((pr) => !ids.includes(pr._id)),
    })
    await mutate(updatedProjects, false)
    showToast("Proyectos borrados correctamente")
  }

  const onEdit = (id) => {
    const project = [...projectsData].find((project) => project._id === id)
    setProjectToUpdate(project)
    setIsProjectModalOpen(true)
  }

  const onSearch = (search) => {
    setSearchChain(search)

    if (search === "") return setSearchedProjects([])

    const results = projectsData.filter(
      (project) =>
        project._id.toLowerCase().includes(search.toLowerCase()) ||
        project.alias.toLowerCase().includes(search.toLowerCase())
    )
    setSearchedProjects(results)
  }

  const handleTabChange = async (value) => {
    if (value === "all") {
      setActiveTab("all")
      // await mutate(projectsData, false)
    } else {
      setActiveTab("active")
      // const _projects = projectsData.filter((project) => !project.isFinished)
      // await mutate(_projects, false)
    }
  }

  const handleOnGroup = () => {
    setFetchState(fetchType.GROUPED)
  }

  const handleOnFilter = () => {
    setFetchState(fetchType.FILTERED)
  }

  useEffect(() => {
    if (isEmptyData || searchChain === "") return
    onSearch(searchChain)
  }, [data])

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
            onAdd={handleOnOpenModal}
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
          onAdd={handleOnOpenModal}
        />
      ) : null}
      {data && !isLoading ? (
        <ProjectsTable
          isGrouped={isGrouped}
          items={searchChain !== "" ? searchedProjects : projectsData}
          onDelete={(id) => handleOpenPopup(id, DeleteType.ONE)}
          onDeleteMany={(ids) => handleOpenPopup(ids, DeleteType.MANY)}
          onEdit={onEdit}
          activeTab={activeTab}
          onTabChange={(value) => handleTabChange(value)}
        />
      ) : null}
    </Page>
  )
}

export default proyectos
