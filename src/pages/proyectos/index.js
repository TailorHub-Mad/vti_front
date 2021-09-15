import { useContext, useEffect, useState } from "react"
import useProjectApi from "../../hooks/api/useProjectApi"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { ProjectsToolBar } from "../../views/projects/ProjectsToolBar/ProjectsToolBar"
import faker from "faker"
import { Popup } from "../../components/overlay/Popup/Popup"
import useFetchSWR from "../../hooks/useFetchSWR"
import { ApiAuthContext } from "../../provider/ApiAuthProvider"
import { SWR_CACHE_KEYS } from "../../utils/constants/swr"
import { ProjectsEmptyState } from "../../views/projects/ProjectsEmptyState/ProjectsEmptyState"
import { NewProjectModal } from "../../views/projects/NewProjectModal/NewProjectModal"
import { Page } from "../../components/layout/Pages/Page"
import { PageHeader } from "../../components/layout/Pages/PageHeader/PageHeader"
import { Spinner } from "../../components/spinner/Spinner"
import { ToastContext } from "../../provider/ToastProvider"
import { ImportFilesModal } from "../../components/overlay/modal/ImportFilesModal/ImportFilesModal"

const DeleteType = {
  ONE: "deleteOne",
  MANY: "deleteMany",
}

const fetchType = {
  ALL: "all",
  GROUPED: "grouped",
  FILTERED: "filtered",
}

const projects = () => {
  const { isLoggedIn } = useContext(ApiAuthContext)
  const {
    getProjects,
    getGroupedProjects,
    deleteProject,
    createProject,
    updateProject,
  } = useProjectApi()
  const { showToast } = useContext(ToastContext)
  const [fetchState, setFetchState] = useState(fetchType.ALL)
  const isGrouped = fetchState === fetchType.GROUPED
  // const isFiltered = fetchState === fetchType.FILTERED

  const fetchHandler = {
    all: () => useFetchSWR(SWR_CACHE_KEYS.projects, getProjects),
    grouped: () => useFetchSWR(SWR_CACHE_KEYS.groupedProjects, getGroupedProjects),
    filtered: () =>
      useFetchSWR([SWR_CACHE_KEYS.groupedProjects, "keys"], getGroupedProjects),
  }

  const { data, error, isLoading, mutate } = fetchHandler[fetchState]()
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

  //TODO también hacer un handler de la transformación de la información
  //Handler global Fetch key, fetcher, data transform

  const projectsData = data
    ? isGrouped
      ? Object.entries(data).slice(0, 30)
      : data[0]?.projects.map((proj) => ({
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

  const handleGrouping = () => {
    setFetchState(fetchType.GROUPED)
  }

  const handleNewProject = async (values) => {
    try {
      const _values = {
        ...values,
        date: { year: values.year.toString(), month: "02", day: "25" },
      }
      delete _values.year
      delete _values.id
      delete _values.tags
      await createProject(_values)
      showToast("Proyecto creado satisfactoriamente")
      setIsProjectModalOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleEditProject = async (values) => {
    try {
      const _values = {
        ...values,
        date: { year: values.year.toString(), month: "02", day: "25" },
      }
      delete _values.year
      delete _values.id
      delete _values.tags
      await updateProject(_values, projectToEdit._id)
      showToast("Proyecto editado satisfactoriamente")
      setIsProjectModalOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (emptyData || searchChain === "") return
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
        projectToEdit={projectToEdit}
        isOpen={isProjectModalOpen}
        onClose={handleOnCloseModal}
        onSubmit={projectToEdit ? handleEditProject : handleNewProject}
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
            onGroup={(option) => handleGrouping(option)}
          />
        ) : null}
      </PageHeader>
      {isLoading ? <Spinner /> : null}
      {emptyData ? (
        <ProjectsEmptyState
          onAddProject={handleOnOpenModal}
          onImport={() => setShowImportModal(true)}
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

export default projects
