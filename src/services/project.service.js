import { ServiceConstructor } from "."

const ProjectService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getProjects = () => execute(instance.get("/projects?limit=50"))
  const getProject = (id) => execute(instance.get(`/projects/${id}`))
  const createProject = (data) => execute(instance.post(`/projects/`, data))
  const updateProject = (id, data) => execute(instance.put(`/projects/${id}`, data))
  const deleteProject = (id) => execute(instance.delete(`/projects/${id}`))

  // GROUP & FILTER
  const getgroupProjects = (data) =>
    execute(instance.get(`/projects/group?group=${data}&real=true`))
  const getfilterProjects = (data) =>
    execute(instance.get(`/projects/filter?${data}`))
  const getSearchProjects = (data) =>
    execute(instance.get(`/projects/group?${data}`))

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

export default ProjectService
