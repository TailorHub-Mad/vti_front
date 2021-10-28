import { ServiceConstructor } from "."

const CodeService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD

  const getCodes = (data = "", limit = 2, offset = 0) =>
    execute(instance.get(`/vtiCode?limit=${limit}&offset=${offset}${data}`))
  const getCode = (id) => execute(instance.get(`/vtiCode/${id}`))
  const createCode = (data) => execute(instance.post(`/vtiCode/create`, data))
  const updateCode = (id, data) =>
    execute(instance.put(`/vtiCode/update/${id}`, data))
  const deleteCode = (id) => execute(instance.delete(`/vtiCode/delete/${id}`))

  // GROUP & FILTER

  const getSearchCodes = (data) =>
    execute(instance.get(`/vtiCode/filter?name=${data}&ref=${data}`))

  return {
    getCodes,
    getCode,
    createCode,
    updateCode,
    deleteCode,

    getSearchCodes
  }
}

export default CodeService
