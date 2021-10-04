import { ServiceConstructor } from "."

const ProjectService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getProjects = (limit = 0, offset = 0) =>
    execute(instance.get(`/projects?limit=${limit}&offset=${offset}`))
  const getProject = (id) => execute(instance.get(`/projects/${id}`))
  const createProject = (data) => execute(instance.post(`/projects/`, data))
  const updateProject = (id, data) => execute(instance.put(`/projects/${id}`, data))
  const deleteProject = (id) => execute(instance.delete(`/projects/${id}`))

  // GROUP & FILTER
  const getGroupProjects = (data) =>
    execute(instance.get(`/projects/group?group=${data}&real=true`))
  const getFilterProjects = (data) =>
    execute(instance.get(`/projects/filter?${data}`))
  const getSearchProjects = (data) =>
    execute(
      instance.get(`/projects/filter?projects.alias=${data}&projects.ref=${data}`)
    )

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

export default ProjectService
