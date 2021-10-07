import DepartmentService from "../../services/department.service"

const useDepartmentApi = () => {
  const departmentService = DepartmentService()

  // CRUD
  const getDepartments = () => departmentService.getDepartments()
  const getDepartment = (_, id) => departmentService.getDepartment(id)
  const createDepartment = (data) => departmentService.createDepartment(data)
  const updateDepartment = (id, data) => departmentService.updateDepartment(id, data)
  const deleteDepartment = (id) => departmentService.deleteDepartment(id)

  // GROUP & FILTER
  const getSearchDepartments = (_, data) =>
    departmentService.getSearchDepartments(data)

  return {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,

    getSearchDepartments
  }
}

export default useDepartmentApi
