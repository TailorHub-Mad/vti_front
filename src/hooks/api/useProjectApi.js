import ProjectService from "../../services/project.service"

const useProjectApi = () => {
  const projectService = ProjectService()

  const getProjects = () => projectService.getProjects()

  const getGroupedProjects = () => projectService.getGroupedProjects()

  const getProject = (id) => projectService.getProject(id)

  const createProject = (data) => projectService.createProject(data)

  const updateProject = (data, id) => projectService.updateProject(data, id)

  const deleteProject = (id) => projectService.deleteProject(id)

  return {
    getProjects,
    getGroupedProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  }
}

export default useProjectApi
