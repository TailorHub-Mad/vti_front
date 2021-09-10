import ServiceConstructor from "."

class ProjectService extends ServiceConstructor {
  getProjects = () => this.makeRequest(this.instance.get("/projects?limit=50"))

  getGroupedProjects = () =>
    this.makeRequest(this.instance.get(`/projects/group?group=client&real=true`))

  getProject = (id) => this.makeRequest(this.instance.get(`/projects/${id}`))

  createProject = (data) => this.makeRequest(this.instance.post(`/projects/`, data))

  updateProject = (data) =>
    this.makeRequest(this.instance.put(`/projects/${data.id}`, data))

  deleteProject = (id) => this.makeRequest(this.instance.delete(`/projects/${id}`))
}

export default ProjectService
