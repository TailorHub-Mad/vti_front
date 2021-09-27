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
  const getgroupProjects = (_, data) => projectService.getgroupProjects(data)
  const getfilterProjects = (_, data) => projectService.getfilterProjects(data)
  const getSearchProjects = (_, data) => projectService.getSearchProjects(data)

  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

    getgroupProjects,
    getfilterProjects,
    getSearchProjects
  }
}

export default useProjectApi
