import { ServiceConstructor } from "."

const DepartmentService = () => {
  const { instance, execute } = ServiceConstructor

  const getDepartments = (limit = 50, offset = 0) =>
    execute(instance.get(`/department?limit=${limit}&offset=${offset}`))
  const getDepartment = (id) => execute(instance.get(`/department/${id}`))
  const createDepartment = (data) =>
    execute(instance.post(`/department/create`, data))
  const updateDepartment = (data) =>
    execute(instance.put(`/department/${data.id}`, data))
  const deleteDepartment = (id) => execute(instance.delete(`/department/${id}`))

  return {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  }
}

export default DepartmentService
