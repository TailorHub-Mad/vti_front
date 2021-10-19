import { ServiceConstructor } from "."

const CodeService = () => {
  const { instance, execute } = ServiceConstructor

  // CRUD

  const getcodes = (data = "", limit = 0, offset = 0) =>
    execute(instance.get(`/code?limit=${limit}&offset=${offset}${data}`))
  const getcode = (id) => execute(instance.get(`/code/${id}`))
  const createcode = (data) => execute(instance.post(`/code/create`, data))
  const updatecode = (id, data) => execute(instance.put(`/code/update/${id}`, data))
  const deletecode = (id) => execute(instance.delete(`/code/delete/${id}`))

  // GROUP & FILTER

  const getSearchcodes = (data) =>
    execute(instance.get(`/code/filter?title=${data}&ref=${data}`))

  return {
    getcodes,
    getcode,
    createcode,
    updatecode,
    deletecode,

    getSearchcodes
  }
}

export default CodeService
