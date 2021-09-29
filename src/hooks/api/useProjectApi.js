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
  const getGroupProjects = (_, data) => projectService.getGroupProjects(data)
  const getFilterProjects = (_, data) => projectService.getFilterProjects(data)
  const getSearchProjects = (_, data) => projectService.getSearchProjects(data)

  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

    getGroupProjects,
    getFilterProjects,
    getSearchProjects
  }
}

export default useProjectApi
