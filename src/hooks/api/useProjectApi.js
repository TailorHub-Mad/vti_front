import ProjectService from "../../services/project.service"

const useProjectApi = () => {
  const projectService = ProjectService()

  // CRUD
  const getProjects = () => projectService.getProjects()
  const getProject = (_, id) => projectService.getProject(id)
  const createProject = (data) => projectService.createProject(data)
  const updateProject = (id, data) => projectService.updateProject(id, data)
  const deleteProject = (id) => projectService.deleteProject(id)

  // GROUP & FILTER
  const getGroupedProjects = (_, data) => projectService.getGroupedProjects(data)
  const getFilteredProjects = (_, data) => projectService.createProject(data)
  const getSearchProjects = (_, data) => projectService.createProject(data)

  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

    getGroupedProjects,
    getFilteredProjects,
    getSearchProjects
  }
}

export default useProjectApi
