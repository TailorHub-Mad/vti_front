import { ServiceConstructor } from "."

const ProjectService = () => {
  const { instance, execute } = ServiceConstructor

  const getProjects = () => execute(instance.get("/projects?limit=50"))

  const getGroupedProjects = () =>
    execute(instance.get(`/projects/group?group=client`))
  //client years sector date.year projects.tags.name tags
  const getProject = (id) => execute(instance.get(`/projects/${id}`))

  const createProject = (data) => execute(instance.post(`/projects/`, data))

  const updateProject = (data, id) => execute(instance.put(`/projects/${id}`, data))

  const deleteProject = (id) => execute(instance.delete(`/projects/${id}`))

  return {
    getProjects,
    getGroupedProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  }
}

export default ProjectService
