import ProjectService from "../../services/project.service"
import useApiError from "../useApiError"

const useProjectApi = () => {
  const { addError, removeError } = useApiError()
  const projectService = new ProjectService(addError, removeError)

  const getProjects = async () => {
    const projects = await projectService.getProjects()
    return projects[0].projects
  }

  const getGroupedProjects = () => projectService.getGroupedProjects()

  const getProject = (id) => projectService.getProject(id)

  const createProject = (data) => projectService.createProject(data)

  const updateProject = (data) => projectService.updateProject(data)

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
