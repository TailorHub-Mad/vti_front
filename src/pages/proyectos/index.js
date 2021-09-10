import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useProjectApi from "../../hooks/api/useProjectApi"
import { ApiToastContext } from "../../provider/ApiToastProvider"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { ProjectsToolBar } from "../../views/projects/ProjectsToolBar/ProjectsToolBar"
import { pullAt } from "lodash"
import faker from "faker"
import { Popup } from "../../components/overlay/Popup/Popup"
import useFetchSWR from "../../hooks/useFetchSWR"
import { ApiUserContext } from "../../provider/ApiAuthProvider"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ImportFilesModal } from "../../views/common/ImportFilesModal/ImportFilesModal"
import { ProjectsEmptyState } from "../../views/projects/ProjectsEmptyState/ProjectsEmptyState"
import { NewProjectModal } from "../../views/projects/NewProjectModal/NewProjectModal"

const DeleteType = {
  ONE: "deleteOne",
  MANY: "deleteMany",
}

const projects = () => {
  const { isLoggedIn } = useContext(ApiUserContext)
  const { getProjects, getGroupedProjects, deleteProject } = useProjectApi()
  const { showToast } = useContext(ApiToastContext)
  const { data, error, isLoading, mutate } = useFetchSWR(
    SWR_CACHE_KEYS.projects,
    getProjects
  )

  const [isGrouped, setIsGrouped] = useState(true)
  const [groupedProjects, setGroupedProjects] = useState(null)

  const [showImportModal, setShowImportModal] = useState(false)

  // Create - Update state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState(null)

  // Delete state
  const [deleteType, setDeleteType] = useState(null)
  const [projectsToDelete, setProjectsToDelete] = useState(null)

  // Search state
  const [searchChain, setSearchChain] = useState("")
  const [searchedProjects, setSearchedProjects] = useState([])

  const emptyData = Boolean(data && data[0]?.projects.length === 0)
  const projectsData = data
    ? data[0]?.projects.map((proj) => ({
        ...proj,
        isFinished: faker.datatype.boolean(),
      }))
    : []

  const [activeTab, setActiveTab] = useState("all")

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
    setProjectToEdit(null)
    setIsProjectModalOpen(false)
  }

  const handleDeleteFunction = async () => {
    const f = deleteType === DeleteType.ONE ? deleteOne : deleteMany
    await f(projectsToDelete, projectsData)
    setDeleteType(null)
    setProjectsToDelete(null)
  }

  const getAliasByIdProject = (id) => {
    const { alias } = projectsData.find((project) => project._id === id)
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

  const deleteMany = async (positions, projects) => {
    const projectsQueue = positions.map((position) =>
      deleteProject(projectsData[position]._id)
    )
    await Promise.all(projectsQueue)
    pullAt(projects, positions)
    const updatedProjects = []
    updatedProjects.push({ projects: projects })
    await mutate(updatedProjects, false)
    showToast("Proyectos borrados correctamente")
  }

  const onEdit = (id) => {
    const project = [...projectsData].find((project) => project._id === id)
    setProjectToEdit(project)
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

  const handleTabChange = (value) => {
    if (value === "all") {
      setActiveTab("all")
      // setProjects(allProjects)
    } else {
      setActiveTab("active")
      // const _projects = allProjects.filter((project) => !project.isFinished)
      // setProjects(_projects)
    }
  }

  useEffect(() => {
    if (emptyData || searchChain === "") return
    onSearch(searchChain)
  }, [data])

  useEffect(() => {
    const fetchGrouped = async () => {
      const _projects = await getGroupedProjects()
      setGroupedProjects(Object.entries(_projects).slice(0,30))
    }
    fetchGrouped()
  }, [])

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
        projectToEdit={projectToEdit}
        isOpen={isProjectModalOpen}
        onClose={handleOnCloseModal}
      />

      <ImportFilesModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <PageHeader title="Proyectos">
        {!isLoading && !emptyData ? (
          <ProjectsToolBar
            onSearch={onSearch}
            onExport={handleExport}
            onImport={() => setShowImportModal(true)}
            onAddProject={handleOnOpenModal}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <LoadingTableSpinner /> : null}
      {emptyData ? (
        <ProjectsEmptyState
          onAddProject={handleOnOpenModal}
          onImport={() => setShowImportModal(true)}
        />
      ) : null}
      {data && groupedProjects && !isLoading ? (
        <ProjectsTable
          isGrouped={isGrouped}
          items={
            isGrouped
              ? groupedProjects
              : searchChain !== ""
              ? searchedProjects
              : projectsData
          }
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

export default projects
