import { ServiceConstructor } from "."

const ProjectService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getProjects = (data = "", limit = 0, offset = 0) =>
    execute(instance.get(`/projects?limit=${limit}&offset=${offset}${data}`))
  const getProject = (id) => execute(instance.get(`/projects/${id}`))
  const createProject = (data) => execute(instance.post(`/projects/`, data))
  const updateProject = (id, data) => execute(instance.put(`/projects/${id}`, data))
  const deleteProject = (id) => execute(instance.delete(`/projects/${id}`))

  // GROUP & FILTER
  const getGroupProjects = (data) =>
    execute(instance.get(`/projects/group?group=${data}&real=true`))
  const getActiveProjects = () =>
    execute(instance.get(`/projects/filter?projects.isActive=true`))
  const getFilterProjects = (query) =>
    execute(instance.get(`/projects/filter?${query}`))
  const getSearchProjects = (data) =>
    execute(
      instance.get(`/projects/filter?projects.alias=${data}&projects.ref=${data}`)
    )

  const getFavsProjects = () => execute(instance.get(`/user/favorite/projects`))
  const getSubscribeProjects = () =>
    execute(instance.get(`/user/subscribed/projects`))

  return {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

    getGroupProjects,
    getActiveProjects,
    getFilterProjects,
    getSearchProjects,
    getFavsProjects,
    getSubscribeProjects
  }
}

export default ProjectService
