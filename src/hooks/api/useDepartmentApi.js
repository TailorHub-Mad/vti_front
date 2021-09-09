import DepartmentService from "../../services/department.service"
import useApiError from "../useApiError"

const useDepartmentApi = () => {
  const { addError, removeError } = useApiError()
  const departmentService = new DepartmentService(addError, removeError)

  const getDepartments = () => {
    // departmentService.getDepartments()
  }

  const getDepartment = (id) => departmentService.getDepartment(id)

  const createDepartment = (data) => departmentService.createDepartment(data)

  const updateDepartment = (data) => departmentService.updateDepartment(data)

  const deleteDepartment = (id) => departmentService.deleteDepartment(id)

  return {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  }
}

export default useDepartmentApi
