import DepartmentService from "../../services/department.service"
import useError from "../useError"

const useDepartmentApi = () => {
  const { addError, removeError } = useError()
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
