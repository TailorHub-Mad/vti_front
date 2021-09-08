import ServiceConstructor from "."

class DepartmentService extends ServiceConstructor {
  getDepartments = () => this.makeRequest(this.instance.get("/department?limit=50"))

  getDepartment = (id) => this.makeRequest(this.instance.get(`/department/${id}`))

  createDepartment = (data) =>
    this.makeRequest(this.instance.post(`/department/create`, data))

  updateDepartment = (data) =>
    this.makeRequest(this.instance.put(`/department/${data.id}`, data))

  deleteDepartment = (id) => this.makeRequest(this.instance.delete(`/department/${id}`))
}

export default DepartmentService
