import { ServiceConstructor } from "."

const CodeService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD

  const getCodes = (data = "", limit = 0, offset = 0) =>
    execute(instance.get(`/sector?limit=${limit}&offset=${offset}${data}`))
  const getCode = (id) => execute(instance.get(`/sector/${id}`))
  const createCode = (data) => execute(instance.post(`/sector/create`, data))
  const updateCode = (id, data) =>
    execute(instance.put(`/sector/update/${id}`, data))
  const deleteCode = (id) => execute(instance.delete(`/sector/delete/${id}`))

  // GROUP & FILTER

  const getSearchCodes = (data) =>
    execute(instance.get(`/sector/filter?title=${data}&ref=${data}`))

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
