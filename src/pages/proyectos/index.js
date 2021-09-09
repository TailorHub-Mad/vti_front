import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/layout/Page/Page"
import { PageHeader } from "../../components/layout/PageHeader/PageHeader"
import { LoadingTableSpinner } from "../../components/spinners/LoadingTableSpinner/LoadingTableSpinner"
import useProjectApi from "../../hooks/api/useProjectApi"
import { MOCK_BACK_PROJECTS_DATA, MOCK_TABLE_DATA } from "../../mock/projects_table"
import { ApiToastContext } from "../../provider/ApiToastProvider"
import { NotesEmptyState } from "../../views/notes/NotesEmptyState/NotesEmptyState"
import { ProjectsTable } from "../../views/projects/ProjectsTable/ProjectsTable"
import { ProjectsToolBar } from "../../views/projects/ProjectsToolBar/ProjectsToolBar"
import faker from "faker"
const projects = () => {
  const { getProjects, deleteProject } = useProjectApi()
  const { showToast } = useContext(ApiToastContext)

  const [isFetching, setIsFetching] = useState(false)

  const [projects, setProjects] = useState(null)
  const [allProjects, setAllProjects] = useState(null)
  const areProjects = projects && projects.length > 0

  const [activeTab, setActiveTab] = useState("all")
  const [showImportModal, setShowImportModal] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  const [projectToEdit, setProjectToEdit] = useState(null)
  const [projectToDelete, setProjectToDelete] = useState(null)

  const onDelete = async (id) => {
    await deleteProject(id)
    setProjectToDelete(null)
    const _projects = [...projects].filter((project) => project._id !== id)
    setProjects(_projects)
    showToast("Projectos borrados correctamente")
    //TODO Diferenciar borrado multiple de individual en el popup
  }

  const onEdit = (id) => {
    const [project] = [...projects].filter((project) => project._id === id)
    setProjectToEdit(project)
    setIsProjectModalOpen(true)
  }

  const handleExport = () => {
    console.log("Export departments")
  }

  const handleSearch = (val) => {
    const results = allProjects.filter(
      (project) =>
        project.alias.toLowerCase().includes(val.toLowerCase()) ||
        project._id.toLowerCase().includes(val.toLowerCase())
    )
    setProjects(results)
  }

  const handleTabChange = (value) => {
    if (value === "all") {
      setActiveTab("all")
      setProjects(allProjects)
    } else {
      setActiveTab("active")
      console.log("ENTRA")
      const _projects = allProjects.filter((project) => !project.isFinished)
      setProjects(_projects)
    }
  }

  useEffect(() => {
    setIsFetching(true)
    const fetchProjects = async () => {
      const _projects = await getProjects()
      const _pro = _projects.map((pro) => ({
        ...pro,
        isFinished: faker.datatype.boolean(),
      }))
      setProjects(_pro)
      setAllProjects(_pro)
      setIsFetching(false)
    }
    fetchProjects()
  }, [])

  return (
    <Page>
      <PageHeader title="Proyectos">
        {areProjects && !isFetching ? (
          <ProjectsToolBar onSearch={(val) => handleSearch(val)} />
        ) : null}
      </PageHeader>
      {isFetching ? <LoadingTableSpinner /> : null}
      {!areProjects ? <NotesEmptyState /> : null}
      {areProjects && !isFetching ? (
        <ProjectsTable
          items={projects}
          activeTab={activeTab}
          onTabChange={(value) => handleTabChange(value)}
        />
      ) : null}
    </Page>
  )
}

export default projects
