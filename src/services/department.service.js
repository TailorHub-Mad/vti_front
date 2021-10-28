import { ServiceConstructor } from "."

const DepartmentService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD
  const getDepartments = (data = "", limit = 0, offset = 0) =>
    execute(instance.get(`/department?limit=${limit}&offset=${offset}${data}`))
  const getDepartment = (id) => execute(instance.get(`/department/${id}`))
  const createDepartment = (data) =>
    execute(instance.post(`/department/create`, data))
  const updateDepartment = (id, data) =>
    execute(instance.put(`/department/update/${id}`, data))
  const deleteDepartment = (id) =>
    execute(instance.delete(`/department/delete/${id}`))

  // GROUP & FILTER
  const getSearchDepartments = (data) =>
    execute(instance.get(`/department/filter?name=${data}&ref=${data}`))

  return {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,

    getSearchDepartments
  }
}

export default DepartmentService
